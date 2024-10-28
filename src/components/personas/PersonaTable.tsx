import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Persona } from "@/integrations/supabase/types/personas";

interface PersonaTableProps {
  personas: Persona[];
}

const placeholderAvatars = [
  'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9',
  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
];

export const PersonaTable = ({ personas }: PersonaTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Persona</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personas.map((persona, index) => (
            <TableRow 
              key={persona.persona_id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/personas/${persona.persona_id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={placeholderAvatars[index % placeholderAvatars.length]} />
                    <AvatarFallback>{persona.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{persona.name}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {persona.description || "No description"}
              </TableCell>
              <TableCell>
                {persona.created_at
                  ? formatDistanceToNow(new Date(persona.created_at), {
                      addSuffix: true,
                    })
                  : "Unknown"}
              </TableCell>
            </TableRow>
          ))}
          {personas.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No personas found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};