import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import { PersonaCards } from "@/components/personas/PersonaCards";
import { PersonaTable } from "@/components/personas/PersonaTable";
import { NewPersonaDialog } from "@/components/personas/NewPersonaDialog";
import { Persona } from "@/integrations/supabase/types/personas";

const Personas = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch personas",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle>Personas</PageTitle>
      
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        <NewPersonaDialog onPersonaCreated={fetchPersonas} />
      </div>

      {viewMode === "table" ? (
        <PersonaTable personas={personas} />
      ) : (
        <PersonaCards personas={personas} />
      )}
    </div>
  );
};

export default Personas;