import Settings from "@/app/components/settings/Settings";
import { Department } from "@/lib/interfaces";
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

async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();

  const { data: departments, error } = await supabase
    .from("departments")
    .select(
      `
      department_id, 
      name, 
      branches:branches(
        branch_id, 
        location, 
        companies:companies(company_id, name)
      )
    `,
    )
    .order("department_id", { ascending: true });

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }

  const flattened: Department[] =
    departments?.flatMap((department) => {
      const branches = Array.isArray(department.branches)
        ? department.branches
        : department.branches
          ? [department.branches]
          : [];

      // ✅ Always return same structure
      if (branches.length === 0) {
        return [
          {
            department_id: department.department_id,
            name: department.name,
            branch_id: undefined,
            branch_location: undefined,
            company_id: undefined,
            company_name: "",
          },
        ];
      }

      return branches.map((branch) => {
        const company = Array.isArray(branch.companies)
          ? branch.companies[0]
          : branch.companies;

        return {
          department_id: department.department_id,
          name: department.name,
          branch_id: branch?.branch_id,
          branch_location: branch?.location,
          company_id: company?.company_id,
          company_name: company?.name || "",
        };
      });
    }) || [];

  return flattened;
}

export default async function SettingsPage() {
  const companies = await getCompanies();
  const branches = await getBranches();
  const departments = await getDepartments();

  return (
    <div>
      <Settings
        companies={companies}
        branches={branches}
        department={departments}
      />
    </div>
  );
}
