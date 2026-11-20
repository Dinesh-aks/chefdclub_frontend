"use client";

import { PageEditor } from "@/features/admin/cms/pages/components/PageEditor";
import { getCmsPageConfig, type CmsPageConfig } from "@/features/admin/cms/pages/pagesConstants";
import type { PageSlug } from "@/lib/api/pages";

interface PagesManagerProps {
  slug: PageSlug;
}

export function PagesManager({ slug }: PagesManagerProps) {
  const config: CmsPageConfig = getCmsPageConfig(slug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{config.label}</h1>
        <p className="mt-2 text-muted-foreground">Edit page content shown on the public site.</p>
      </div>

      <PageEditor slug={slug} config={config} />
    </div>
  );
}
