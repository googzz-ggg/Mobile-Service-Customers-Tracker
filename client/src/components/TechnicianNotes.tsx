import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TechnicianNotesProps {
  notes: Array<{
    id: number;
    stage: string;
    technicianNotes?: string | null;
    createdAt: Date;
  }>;
}

export default function TechnicianNotes({ notes }: TechnicianNotesProps) {
  const notesWithContent = notes.filter((n) => n.technicianNotes);

  if (notesWithContent.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Technician Notes
        </CardTitle>
        <CardDescription>Updates from our service team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notesWithContent.map((note) => (
          <div key={note.id} className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
            <div className="flex items-start justify-between mb-2">
              <Badge className="bg-accent/20 text-accent border-accent/30">{note.stage}</Badge>
              <span className="text-xs text-foreground/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground/80">{note.technicianNotes}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
