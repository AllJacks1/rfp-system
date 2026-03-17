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

async function getBranches() {
  const supabase = await createClient();

  const { data: branches, error } = await supabase
    .from("branches")
    .select(
      `
      branch_id, 
      location, 
      companies:companies(company_id, name)
    `,
    )
    .order("branch_id", { ascending: true });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  // Flatten the nested companies array into a single company object
  const flattenedBranches =
    branches?.map((branch) => ({
      branch_id: branch.branch_id,
      location: branch.location,
      company: Array.isArray(branch.companies)
        ? branch.companies[0]
        : branch.companies,
    })) || [];

  return flattenedBranches;
}

export default async function SettingsPage() {
  const companies = await getCompanies();
  const branches = await getBranches();

  return (
    <div>
      <Settings companies={companies} branches={branches} />
    </div>
  );
}
