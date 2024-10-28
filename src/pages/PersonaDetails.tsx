import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditableField } from "@/components/ui/editable-field";
import { MetadataTable } from "@/components/personas/MetadataTable";
import { Persona } from "@/integrations/supabase/types/personas";
import { Json } from "@/integrations/supabase/types/json";

const PersonaDetails = () => {
  const { personaId } = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchPersona = async () => {
    try {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("persona_id", personaId)
        .single();

      if (error) throw error;
      setPersona(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch persona details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateField = async (field: keyof Persona, value: string | Record<string, Json>) => {
    try {
      const { error } = await supabase
        .from("personas")
        .update({ [field]: value })
        .eq("persona_id", personaId);

      if (error) throw error;
      
      await fetchPersona();
      
      toast({
        title: "Success",
        description: "Persona updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update persona",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (personaId) {
      fetchPersona();
    }
  }, [personaId]);

  if (!persona) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageTitle>
        <EditableField
          value={persona.name}
          onSave={(value) => handleUpdateField("name", value)}
          className="text-3xl font-bold"
        />
      </PageTitle>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Description</h2>
        <EditableField
          value={persona.description || ""}
          onSave={(value) => handleUpdateField("description", value)}
          inputType="textarea"
          placeholder="No description"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Metadata</h2>
        <MetadataTable
          metadata={persona.metadata}
          onUpdate={async (metadata) => {
            await handleUpdateField("metadata", metadata);
          }}
        />
      </div>
    </div>
  );
};

export default PersonaDetails;