import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { Persona } from "@/integrations/supabase/types/tables/personas.types";

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <Link href={`/personas/${persona.persona_id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
            <UserRound className="w-12 h-12 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <h3 className="text-xl font-semibold mb-2">{persona.name}</h3>
          {persona.goal && (
            <p className="text-sm text-muted-foreground mb-4">{persona.goal}</p>
          )}
          {persona.description && (
            <p className="text-sm line-clamp-3">{persona.description}</p>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <span className="text-sm text-purple-600 hover:text-purple-700">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}