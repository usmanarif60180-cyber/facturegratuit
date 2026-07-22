import { PageHeader } from "@/components/layout/PageHeader";
import { AIAssistantPanel } from "@/components/ai/AIAssistantPanel";

export default function AIAssistantPage() {
  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Your intelligent business assistant — more capabilities rolling out soon."
      />
      <AIAssistantPanel />
    </div>
  );
}
