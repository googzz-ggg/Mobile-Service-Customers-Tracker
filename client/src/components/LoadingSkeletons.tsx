import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <div className="h-6 bg-foreground/10 rounded w-1/3 mb-2" />
        <div className="h-4 bg-foreground/5 rounded w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 bg-foreground/10 rounded w-full" />
        <div className="h-4 bg-foreground/10 rounded w-5/6" />
        <div className="h-4 bg-foreground/10 rounded w-4/6" />
      </CardContent>
    </Card>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-foreground/10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-foreground/10 rounded w-1/4" />
            <div className="h-3 bg-foreground/5 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-lg bg-foreground/5">
          <div className="h-4 bg-foreground/10 rounded flex-1" />
          <div className="h-4 bg-foreground/10 rounded w-1/4" />
          <div className="h-4 bg-foreground/10 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <div className="h-6 bg-foreground/10 rounded w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-foreground/5 rounded" />
      </CardContent>
    </Card>
  );
}
