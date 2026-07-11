import { PageHeader } from "@/components/layout/PageHeader";
import { DesignStudioClient } from "@/components/design-studio/DesignStudioClient";

export default function DesignStudioPage() {
  return (
    <div>
      <PageHeader
        title="Design Studio"
        description="Customize the look of every invoice and quote — templates, themes, fonts, colors, layout and more."
      />
      <DesignStudioClient />
    </div>
  );
}
