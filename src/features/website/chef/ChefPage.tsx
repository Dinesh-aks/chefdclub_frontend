import { ChefCta } from "@/features/website/chef/components/ChefCta";
import { ChefHero } from "@/features/website/chef/components/ChefHero";
import { ChefStory } from "@/features/website/chef/components/ChefStory";
import { KitchenStandards } from "@/features/website/chef/components/KitchenStandards";
import { loadAboutUsCms } from "@/features/website/chef/loadAboutUsCms";

export async function ChefPage() {
  const cms = await loadAboutUsCms();

  return (
    <>
      <ChefHero />
      <ChefStory bannerUrl={cms?.bannerUrl} bodyHtml={cms?.description} />
      <KitchenStandards />
      <ChefCta />
    </>
  );
}
