"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  LogOutIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SettingsIcon,
} from "lucide-react";
import type { AdminProfile } from "@/lib/api/core/adminAuth";
import { adminLogout } from "@/lib/api/core/adminAuth";
import {
  adminBottomNavItems,
  adminNavItems,
  flattenAdminNavLeaves,
  isAdminNavGroup,
  type AdminNavEntry,
  type AdminNavGroup,
  type AdminNavLeaf,
} from "@/config/adminNav";
import { getAdminNavIconClass } from "@/config/adminNavIconColors";
import { siteConfig } from "@/config/site";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo, LogoMark } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  admin: AdminProfile;
  children: React.ReactNode;
};

type NavSection = { label: string; items: AdminNavEntry[] };

/** Top-level leaves form "Operations"; each group (e.g. CMS) becomes its own labelled section. */
const NAV_SECTIONS: NavSection[] = (() => {
  const sections: NavSection[] = [];
  const operations: AdminNavLeaf[] = [];
  for (const entry of adminNavItems) {
    if (isAdminNavGroup(entry)) {
      sections.push({ label: entry.label, items: entry.children });
    } else {
      operations.push(entry);
    }
  }
  return [{ label: "Operations", items: operations }, ...sections];
})();

function initials(admin: AdminProfile): string {
  const first = admin.firstName.charAt(0);
  const last = admin.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

function isActive(pathname: string, href: string, exact: boolean): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

function findCrumbs(pathname: string): { section: string; folder?: string; page: string } {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (isAdminNavGroup(item)) {
        const leaf = flattenAdminNavLeaves([item]).find((child) =>
          isActive(pathname, child.href, child.exact),
        );
        if (leaf) {
          return { section: section.label, folder: item.label, page: leaf.label };
        }
        continue;
      }
      if (isActive(pathname, item.href, item.exact)) {
        return { section: section.label, page: item.label };
      }
    }
  }
  const bottom = adminBottomNavItems.find((item) => isActive(pathname, item.href, item.exact));
  return { section: "Admin", page: bottom?.label ?? "Admin" };
}

const linkClassName =
  "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors";
const activeLinkClassName =
  "bg-primary/8 text-foreground before:absolute before:top-1.5 before:bottom-1.5 before:-left-3 before:w-[3px] before:rounded-r before:bg-primary/55";
const inactiveLinkClassName = "text-muted-foreground hover:bg-muted hover:text-foreground";

/** Icon-only item: a fixed square with the icon dead centre, identical for links and buttons. */
const COLLAPSED_ITEM_CLASSNAME = "mx-auto size-9 justify-center gap-0 p-0 before:-left-2";

function sidebarNavIconClass(colorClass: string, nested = false) {
  return cn("shrink-0", nested ? "size-3.5" : "size-4", colorClass);
}

function NavFolder({
  group,
  pathname,
  collapsed,
}: {
  group: AdminNavGroup;
  pathname: string;
  collapsed: boolean;
}) {
  const leaves = flattenAdminNavLeaves(group.children);
  const hasActiveChild = leaves.some((item) => isActive(pathname, item.href, item.exact));
  const [open, setOpen] = useState(hasActiveChild);
  const [prevHasActiveChild, setPrevHasActiveChild] = useState(hasActiveChild);
  const Icon = group.icon;

  if (hasActiveChild !== prevHasActiveChild) {
    setPrevHasActiveChild(hasActiveChild);
    if (hasActiveChild) {
      setOpen(true);
    }
  }

  if (collapsed) {
    return (
      <>
        {leaves.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href, item.exact)}
            collapsed={collapsed}
          />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={cn(
          linkClassName,
          "w-full text-left",
          hasActiveChild ? "text-foreground" : inactiveLinkClassName,
        )}
      >
        <Icon
          className={sidebarNavIconClass(getAdminNavIconClass({ groupLabel: group.label }))}
          aria-hidden="true"
        />
        <span className="flex-1">{group.label}</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
          {group.children.map((child) =>
            isAdminNavGroup(child) ? (
              <NavFolder key={child.label} group={child} pathname={pathname} collapsed={collapsed} />
            ) : (
              <NavLink
                key={child.href}
                item={child}
                active={isActive(pathname, child.href, child.exact)}
                collapsed={collapsed}
                nested
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  nested = false,
}: {
  item: AdminNavLeaf;
  active: boolean;
  collapsed: boolean;
  nested?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        linkClassName,
        active ? activeLinkClassName : inactiveLinkClassName,
        collapsed && COLLAPSED_ITEM_CLASSNAME,
        nested && !collapsed && "py-1 text-[12px]",
      )}
    >
      <Icon
        className={sidebarNavIconClass(getAdminNavIconClass({ href: item.href }), nested)}
        aria-hidden="true"
      />
      <span className={cn(collapsed && "sr-only")}>{item.label}</span>
    </Link>
  );
}

/*
 * Sidebar collapsed state, remembered in localStorage. Kept in a tiny external
 * store so it can be read without a setState-in-effect and stays in sync
 * across tabs; `current` is also the fallback when storage is unavailable.
 */
const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";
const sidebarListeners = new Set<() => void>();
let sidebarCollapsedValue: boolean | null = null;

function readStoredSidebarState(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeSidebar(listener: () => void) {
  sidebarListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) {
      sidebarCollapsedValue = readStoredSidebarState();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sidebarListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSidebarSnapshot(): boolean {
  if (sidebarCollapsedValue === null) {
    sidebarCollapsedValue = readStoredSidebarState();
  }
  return sidebarCollapsedValue;
}

function getSidebarServerSnapshot(): boolean {
  return false;
}

function setSidebarCollapsed(next: boolean) {
  sidebarCollapsedValue = next;
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Storage unavailable — the choice just isn't remembered after a reload.
  }
  sidebarListeners.forEach((listener) => listener());
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const collapsed = useSyncExternalStore(subscribeSidebar, getSidebarSnapshot, getSidebarServerSnapshot);

  function toggleSidebar() {
    setSidebarCollapsed(!collapsed);
  }

  const crumbs = findCrumbs(pathname);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await adminLogout();
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex",
            collapsed ? "w-14" : "w-[232px]",
          )}
        >
          {collapsed ? (
            <div className="flex h-[70px] items-center justify-center border-b border-border">
              <LogoMark href="/admin" size="xs" />
            </div>
          ) : (
            <div className="border-b border-border px-5 pt-5 pb-4">
              <Logo href="/admin" textClassName="text-[22px]" hideLocation onDark={false} />
              <p className="mt-2 text-[10px] tracking-mega text-muted-foreground uppercase">
                {siteConfig.location} · Admin
              </p>
            </div>
          )}

          <nav
            className={cn(
              "admin-sidebar-scroll flex flex-1 flex-col gap-4 overflow-y-auto py-4",
              collapsed ? "px-2" : "px-3",
            )}
            aria-label="Main"
          >
            {NAV_SECTIONS.map((section, index) => (
              <div key={section.label} className="flex flex-col gap-0.5">
                {collapsed ? (
                  index > 0 ? <div className="mx-2 mb-1 border-t border-border" aria-hidden="true" /> : null
                ) : (
                  <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                    {section.label}
                  </p>
                )}
                {section.items.map((item) =>
                  isAdminNavGroup(item) ? (
                    <NavFolder
                      key={item.label}
                      group={item}
                      pathname={pathname}
                      collapsed={collapsed}
                    />
                  ) : (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActive(pathname, item.href, item.exact)}
                      collapsed={collapsed}
                    />
                  ),
                )}
              </div>
            ))}
          </nav>

          <div className={cn("flex flex-col gap-0.5 border-t border-border", collapsed ? "p-2" : "p-3")}>
            {adminBottomNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href, item.exact)}
                collapsed={collapsed}
              />
            ))}
            <button
              type="button"
              onClick={() => setConfirmLogoutOpen(true)}
              title={collapsed ? "Log out" : undefined}
              className={cn(linkClassName, inactiveLinkClassName, "text-left", collapsed && COLLAPSED_ITEM_CLASSNAME)}
            >
              <LogOutIcon className="size-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span className={cn(collapsed && "sr-only")}>Log out</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!collapsed}
                className="hidden size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:inline-flex"
              >
                {collapsed ? (
                  <PanelLeftOpenIcon className="size-[18px]" aria-hidden="true" />
                ) : (
                  <PanelLeftCloseIcon className="size-[18px]" aria-hidden="true" />
                )}
              </button>
              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
                <span className="text-muted-foreground">{crumbs.section}</span>
                {crumbs.folder ? (
                  <>
                    <span className="text-muted-foreground/60" aria-hidden="true">
                      /
                    </span>
                    <span className="text-muted-foreground">{crumbs.folder}</span>
                  </>
                ) : null}
                <span className="text-muted-foreground/60" aria-hidden="true">
                  /
                </span>
                <span className="truncate font-semibold" aria-current="page">
                  {crumbs.page}
                </span>
              </nav>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar>
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials(admin)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden flex-col leading-tight sm:flex">
                  <span className="text-sm font-semibold">Admin</span>
                  <span className="text-xs text-muted-foreground">Administrator</span>
                </span>
                <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">
                    {admin.firstName} {admin.lastName ?? ""}
                  </p>
                  <p className="text-xs font-normal text-muted-foreground">{admin.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <SettingsIcon className="size-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmLogoutOpen(true)}>
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>

      <Dialog open={confirmLogoutOpen} onOpenChange={(open) => !loggingOut && setConfirmLogoutOpen(open)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Log out?</DialogTitle>
            <DialogDescription>You will need to sign in again to use the admin.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loggingOut}
              onClick={() => setConfirmLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={loggingOut} onClick={() => void handleLogout()}>
              {loggingOut ? "Logging out…" : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
