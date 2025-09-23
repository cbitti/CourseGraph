import ApiDocs from "@/components/ApiDocs";

export const dynamic = "force-static";

export default function DocsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">API Docs</h1>
      <ApiDocs />
    </div>
  );
}
