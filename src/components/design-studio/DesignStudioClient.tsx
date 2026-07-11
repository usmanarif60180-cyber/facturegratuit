"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useSavedDesigns } from "@/hooks/useSavedDesigns";
import { savedDesignService } from "@/lib/services/savedDesignService";
import { setActiveDesign, updateBrandKit } from "@/lib/services/designService";
import { updateOrganization } from "@/lib/services/organizationService";
import { DEFAULT_DESIGN_CONFIG } from "@/lib/design/defaults";
import { DEFAULT_ORGANIZATION_SETTINGS } from "@/types/organization";
import { DesignableDocument } from "@/components/design/DesignableDocument";
import { SAMPLE_DESIGNABLE_DOC } from "@/lib/design/documentAdapter";
import { TemplateGalleryPanel } from "./TemplateGalleryPanel";
import { ThemeDesignerPanel } from "./ThemeDesignerPanel";
import { FontStudioPanel } from "./FontStudioPanel";
import { ColorDesignerPanel } from "./ColorDesignerPanel";
import { LayoutBuilderPanel } from "./LayoutBuilderPanel";
import { TableDesignPanel } from "./TableDesignPanel";
import { PageSetupPanel } from "./PageSetupPanel";
import { AiDesignerPanel } from "./AiDesignerPanel";
import { BrandKitPanel } from "./BrandKitPanel";
import type { BrandKit, DesignConfig, SavedDesign, Template } from "@/types/design";
import type { Client, Organization } from "@/types";

const SAMPLE_CLIENT: Client = {
  id: "sample",
  organizationId: "sample",
  displayName: "Atlas Studio",
  email: "billing@atlasstudio.co",
  address: { city: "Austin, TX" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function DesignStudioClient() {
  const { profile } = useAuth();
  const { organization } = useOrganization();
  const { items: savedThemes } = useSavedDesigns();
  const { toast } = useToast();

  const [design, setDesign] = React.useState<DesignConfig>(DEFAULT_DESIGN_CONFIG);
  const [brandKit, setBrandKit] = React.useState<BrandKit>({});
  const [saving, setSaving] = React.useState(false);
  const seeded = React.useRef(false);

  React.useEffect(() => {
    if (organization && !seeded.current) {
      setDesign(organization.designConfig ?? DEFAULT_DESIGN_CONFIG);
      setBrandKit(organization.brandKit ?? {});
      seeded.current = true;
    }
  }, [organization]);

  async function handleSave() {
    if (!profile?.organizationId) return;
    setSaving(true);
    try {
      await setActiveDesign(profile.organizationId, design);
      await updateBrandKit(profile.organizationId, brandKit);
      toast({ variant: "success", title: "Design saved", description: "Applied to all future invoices and quotes." });
    } finally {
      setSaving(false);
    }
  }

  function applyTemplate(template: Template) {
    setDesign(template.design);
    toast({ variant: "success", title: `Applied "${template.name}"` });
  }

  async function handleSaveTheme(name: string) {
    if (!profile?.organizationId) return;
    await savedDesignService.create(profile.organizationId, { name, config: { ...design, name } });
  }

  async function handleRenameTheme(id: string, name: string) {
    if (!profile?.organizationId) return;
    await savedDesignService.update(profile.organizationId, id, { name });
  }

  async function handleDuplicateTheme(theme: SavedDesign) {
    if (!profile?.organizationId) return;
    await savedDesignService.create(profile.organizationId, { name: `${theme.name} copy`, config: theme.config });
  }

  async function handleDeleteTheme(id: string) {
    if (!profile?.organizationId) return;
    await savedDesignService.remove(profile.organizationId, id);
  }

  async function handleLogoUploaded(url: string) {
    if (!profile?.organizationId) return;
    await updateOrganization(profile.organizationId, { logoUrl: url });
  }

  const previewOrganization: Organization = organization
    ? { ...organization, designConfig: design, brandKit }
    : {
        id: "sample-org",
        ownerId: "sample",
        name: "Your Business",
        settings: DEFAULT_ORGANIZATION_SETTINGS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designConfig: design,
        brandKit,
      };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_26rem]">
      <div>
        <Tabs defaultValue="templates">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="page">Page setup</TabsTrigger>
            <TabsTrigger value="ai">AI Designer</TabsTrigger>
            <TabsTrigger value="brand">Brand Kit</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="templates">
                <TemplateGalleryPanel onApply={applyTemplate} />
              </TabsContent>
              <TabsContent value="theme">
                <ThemeDesignerPanel
                  design={design}
                  onChange={setDesign}
                  savedThemes={savedThemes}
                  onSaveTheme={handleSaveTheme}
                  onRenameTheme={handleRenameTheme}
                  onDuplicateTheme={handleDuplicateTheme}
                  onDeleteTheme={handleDeleteTheme}
                  onSetDefault={(theme) => setDesign(theme.config)}
                  defaultThemeId={brandKit.activeDesignId}
                />
              </TabsContent>
              <TabsContent value="fonts">
                <FontStudioPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="colors">
                <ColorDesignerPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="layout">
                <LayoutBuilderPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="table">
                <TableDesignPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="page">
                <PageSetupPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="ai">
                <AiDesignerPanel design={design} onChange={setDesign} />
              </TabsContent>
              <TabsContent value="brand">
                <BrandKitPanel
                  brandKit={brandKit}
                  onChange={setBrandKit}
                  organization={organization}
                  onLogoUploaded={handleLogoUploaded}
                  design={design}
                  onApplyIndustry={(nextDesign, nextBrandKit) => {
                    setDesign(nextDesign);
                    setBrandKit(nextBrandKit);
                  }}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <div className="lg:sticky lg:top-6 lg:h-fit">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Live preview</p>
          <Button size="sm" loading={saving} onClick={handleSave}>Save &amp; apply</Button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-auto rounded-xl bg-muted/40 p-3">
          <div className="origin-top scale-[0.72]">
            <DesignableDocument
              doc={SAMPLE_DESIGNABLE_DOC}
              client={SAMPLE_CLIENT}
              organization={previewOrganization}
              design={design}
              brandKit={brandKit}
              locale={organization?.settings.defaultLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
