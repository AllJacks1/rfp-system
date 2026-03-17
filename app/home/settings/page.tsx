import Settings from "@/app/components/settings/Settings";
import { createClient } from "@/lib/supabase/server";

async function getCompanies() {
  const supabase = await createClient();
  
  const { data: companies, error } = await supabase
    .from("companies")
    .select("company_id, name")
    .order("name", { ascending: true });
  
  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
  
  return companies || [];
}

export default async function SettingsPage() {
  const companies = await getCompanies();
  
  return (
    <div>
      <Settings companies={companies} />
    </div>
  );
}