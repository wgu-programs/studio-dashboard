import { PersonaCard } from "@/components/personas/PersonaCard";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function PersonasPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: personas } = await supabase
    .from("personas")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Personas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas?.map((persona) => (
          <PersonaCard key={persona.persona_id} persona={persona} />
        ))}
      </div>
    </div>
  );
}