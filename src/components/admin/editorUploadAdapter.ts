import type { Editor, FileLoader } from "ckeditor5";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import type { ApiSuccessResponse } from "@/lib/api/core/types";

/**
 * Uploads images added to the rich text editor (file picker, drag-drop or paste) to the backend.
 * The backend stores the file and returns a relative `/uploads/...` path. It is saved as-is (not
 * made absolute) so it works on any host; next.config.ts proxies `/uploads/*` to the backend.
 */
class EditorUploadAdapter {
  private readonly controller = new AbortController();

  constructor(
    private readonly loader: FileLoader,
    private readonly endpoint: string,
    private readonly requiresPostId: boolean,
  ) {}

  async upload(): Promise<{ default: string }> {
    if (this.requiresPostId) {
      throw new Error("Save this journal post first, then add body images when editing it.");
    }
    const file = await this.loader.file;
    if (!file) {
      throw new Error("No file to upload");
    }

    const body = new FormData();
    body.append("upload", file);

    const response = await adminApiFetch<ApiSuccessResponse<{ url: string }>>(this.endpoint, {
      method: "POST",
      body,
      signal: this.controller.signal,
    });
    return { default: response.data.url };
  }

  abort(): void {
    this.controller.abort();
  }
}

/** Features whose editor images get their own backend upload endpoint (`/admin/uploads/editor-image/<folder>`). */
export type EditorUploadFolder = "journal";

/** Builds the CKEditor plugin that registers the adapter above as the editor's upload handler. */
export function createEditorUploadAdapterPlugin(
  folder?: EditorUploadFolder,
  journalPostId?: number,
) {
  const endpoint =
    folder === "journal" && journalPostId !== undefined
      ? `/admin/uploads/editor-image/journal?postId=${journalPostId}`
      : folder
        ? `/admin/uploads/editor-image/${folder}`
        : "/admin/uploads/editor-image";
  const requiresPostId = folder === "journal" && journalPostId === undefined;

  return function EditorUploadAdapterPlugin(editor: Editor): void {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: FileLoader) =>
      new EditorUploadAdapter(loader, endpoint, requiresPostId);
  };
}
