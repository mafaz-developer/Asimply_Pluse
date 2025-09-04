import { Card, CardContent } from "@/components/ui/card";

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <Card className="bg-white/10 border-white/10 text-white">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-white/80">This page is a placeholder. Ask to generate full content when ready.</p>
        </CardContent>
      </Card>
    </div>
  );
}
