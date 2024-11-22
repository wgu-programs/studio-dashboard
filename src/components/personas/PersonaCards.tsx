import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Persona } from "@/integrations/supabase/types/personas";

interface PersonaCardsProps {
  personas: Persona[];
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
];

export const PersonaCards = ({ personas }: PersonaCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas.map((persona, index) => (
        <Card 
          key={persona.persona_id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/personas/${persona.persona_id}`)}
        >
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={placeholderImages[index % placeholderImages.length]} />
                <AvatarFallback>{persona.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{persona.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(persona.created_at || ''), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {persona.goal && (
              <div>
                <h3 className="font-medium text-sm">Goal</h3>
                <p className="text-sm text-muted-foreground">{persona.goal}</p>
              </div>
            )}
            {persona.description && (
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="text-sm text-muted-foreground">{persona.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};