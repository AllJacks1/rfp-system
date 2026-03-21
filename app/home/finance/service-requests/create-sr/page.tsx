import CreateServiceRequestForm from "@/app/components/service-requests/CreateServiceRequestForm";
import { createClient } from "@/lib/supabase/server";

async function getTypes(supabase: any) {
  const { data, error } = await supabase
    .from("types")
    .select("type_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching types:", error);
    return [];
  }

  console.log("DATA:", data);

  return data || [];
}

export default async function CreateServiceRequestPage() {
  const supabase = await createClient();

  const types = await getTypes(supabase);

  console.log(types);

  return (
    <div>
      <CreateServiceRequestForm types={types} />
    </div>
  );
}