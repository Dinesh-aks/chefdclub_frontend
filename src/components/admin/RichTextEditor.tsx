"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { cn } from "@/lib/utils";
import type { ClassicEditor } from "ckeditor5";
import {
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  BlockQuote,
  Bold,
  ClassicEditor as ClassicEditorClass,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  Underline,
} from "ckeditor5";

import { createEditorUploadAdapterPlugin, type EditorUploadFolder } from "./editorUploadAdapter";
import "ckeditor5/ckeditor5.css";
import "./rich-text-editor.css";

function toCssLength(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

function applyEditableHeight(editor: ClassicEditor, heightCss: string): void {
  const editable = editor.ui.getEditableElement();
  if (!editable) return;
  editable.style.height = heightCss;
  editable.style.minHeight = heightCss;
  editable.style.maxHeight = heightCss;
  editable.style.overflowY = "auto";
  editable.style.boxSizing = "border-box";
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Fixed height of the editable area; long content scrolls inside. Number = px; string = CSS length (default `16rem`). */
  height?: string | number;
  /** Stores pasted/uploaded images in this feature's own backend folder; omit for the shared editor folder. */
  uploadFolder?: EditorUploadFolder;
}

const MIN_RESIZE_PX = 160;
const MAX_RESIZE_PX = 1400;

export function RichTextEditor({
  value,
  onChange,
  id,
  height = "16rem",
  uploadFolder,
}: RichTextEditorProps) {
  // Set while the user drags the handle; null means "use the `height` prop".
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  // In fullscreen the editing area fills the viewport below the toolbar and above the bottom bar.
  const editableHeight = fullscreen
    ? "calc(100dvh - 9rem)"
    : dragHeight !== null
      ? `${dragHeight}px`
      : toCssLength(height);
  const editorRef = useRef<ClassicEditor | null>(null);
  const heightRef = useRef(editableHeight);
  heightRef.current = editableHeight;

  const bindEditorHeight = useCallback((editor: ClassicEditor) => {
    editorRef.current = editor;
    applyEditableHeight(editor, heightRef.current);

    // CKEditor may resize the editable after load / data changes — re-apply our box.
    editor.model.document.on("change:data", () => {
      applyEditableHeight(editor, heightRef.current);
    });
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      applyEditableHeight(editorRef.current, editableHeight);
    }
  }, [editableHeight]);

  const rteHeightStyle = { "--rte-height": editableHeight } as CSSProperties;

  // Esc leaves fullscreen, and the page behind does not scroll while it is open.
  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreen]);

  function handleResizeStart(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = editorRef.current?.ui.getEditableElement()?.offsetHeight ?? MIN_RESIZE_PX;
    dragRef.current = { startY: event.clientY, startHeight: current };
  }

  function handleResizeMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const next = drag.startHeight + (event.clientY - drag.startY);
    setDragHeight(Math.min(MAX_RESIZE_PX, Math.max(MIN_RESIZE_PX, Math.round(next))));
  }

  function handleResizeEnd(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      id={id}
      data-fullscreen={fullscreen}
      className={cn(
        "chefdclub-rich-text-editor rounded-lg border border-input",
        fullscreen && "fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-card",
      )}
      style={rteHeightStyle}
    >
      <CKEditor
        editor={ClassicEditorClass}
        data={value}
        onReady={bindEditorHeight}
        onChange={(_event, editor) => onChange(editor.getData())}
        config={{
          licenseKey: "GPL",
          extraPlugins: [createEditorUploadAdapterPlugin(uploadFolder)],
          plugins: [
            Essentials,
            Autoformat,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            RemoveFormat,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Alignment,
            Link,
            AutoLink,
            List,
            ListProperties,
            Indent,
            IndentBlock,
            BlockQuote,
            HorizontalLine,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            Image,
            AutoImage,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageResize,
            ImageTextAlternative,
            ImageInsert,
            ImageInsertViaUrl,
            ImageUpload,
            MediaEmbed,
            SpecialCharacters,
            SpecialCharactersEssentials,
            FindAndReplace,
            PasteFromOffice,
            SourceEditing,
          ],
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontFamily",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "removeFormat",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
            "|",
            "link",
            "blockQuote",
            "insertImage",
            "insertTable",
            "mediaEmbed",
            "horizontalLine",
            "specialCharacters",
            "|",
            "findAndReplace",
            "sourceEditing",
          ],
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
              "resizeImage",
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
        }}
      />
      {/* Drag to make the editing area taller or shorter; double-click to go back to the default. */}
      <div className="flex h-7 shrink-0 items-center border-t border-input bg-muted/40 px-2">
        <span className="w-24 text-xs text-muted-foreground">{fullscreen ? "Esc to exit" : null}</span>
        {fullscreen ? (
          <span className="flex-1" />
        ) : (
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize editor"
            title="Drag to resize · double-click to reset"
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
            onDoubleClick={() => setDragHeight(null)}
            className="flex h-full flex-1 cursor-ns-resize touch-none items-center justify-center hover:bg-muted"
          >
            <span className="h-0.5 w-8 rounded-full bg-muted-foreground/50" aria-hidden="true" />
          </div>
        )}
        <div className="flex w-24 justify-end">
          <button
            type="button"
            onClick={() => setFullscreen((value) => !value)}
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            title={fullscreen ? "Exit full screen (Esc)" : "Full screen"}
          >
            {fullscreen ? (
              <Minimize2Icon className="size-4" aria-hidden="true" />
            ) : (
              <Maximize2Icon className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
