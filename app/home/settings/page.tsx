import Settings from "@/app/components/settings/Settings";
import { Department, FlattendUser, UserAssignmentRow } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

/* ================================
   USERS
================================ */

async function getUsers(supabase: SupabaseClient): Promise<FlattendUser[]> {
  const { data, error } = await supabase.from("user_assignments").select(`
      users(
        user_id,
        first_name,
        middle_name,
        last_name,
        email,
        mobile_number,
        address,
        birthday,
        sex
      ),
      roles(role_id, name),
      designations(designation_id, name),
      companies(company_id, name),
      branches(branch_id, location, company_id),
      departments(department_id, name, branch_id)
    `);

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  const rows = (data || []) as unknown as UserAssignmentRow[];

  return rows.map((row) => ({
    user_id: row.users?.user_id ?? "",
    first_name: row.users?.first_name ?? "",
    middle_name: row.users?.middle_name ?? "",
    last_name: row.users?.last_name ?? "",
    email: row.users?.email ?? "",
    mobile_number: row.users?.mobile_number ?? "",
    address: row.users?.address ?? "",
    birthday: row.users?.birthday ?? "",
    sex: row.users?.sex ?? "",

    role_id: row.roles?.role_id,
    role_name: row.roles?.name ?? "",

    designation_id: row.designations?.designation_id,
    designation_name: row.designations?.name ?? "",

    company_id: row.companies?.company_id,
    company_name: row.companies?.name ?? "",

    branch_id: row.branches?.branch_id,
    branch_location: row.branches?.location ?? "",

    department_id: row.departments?.department_id,
    department_name: row.departments?.name ?? "",
  }));
}

/* ================================
   COMPANIES
================================ */

async function getCompanies(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("companies")
    .select("company_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }

  return data || [];
}

/* ================================
   BRANCHES
================================ */

async function getBranches(supabase: SupabaseClient) {
  const { data, error } = await supabase
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

  return (
    data?.map((branch) => ({
      branch_id: branch.branch_id,
      location: branch.location,
      company: Array.isArray(branch.companies)
        ? branch.companies[0]
        : branch.companies,
    })) || []
  );
}

/* ================================
   DEPARTMENTS
================================ */

async function getDepartments(supabase: SupabaseClient): Promise<Department[]> {
  const { data, error } = await supabase
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

  return (
    data?.flatMap((department) => {
      const branches = Array.isArray(department.branches)
        ? department.branches
        : department.branches
          ? [department.branches]
          : [];

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
          company_name: company?.name ?? "",
        };
      });
    }) || []
  );
}

/* ================================
   ROLES
================================ */

async function getRoles(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("roles")
    .select("role_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }

  return data || [];
}

/* ================================
   DESIGNATIONS
================================ */

async function getDesignations(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("designations")
    .select("designation_id, name, scope")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching designations:", error);
    return [];
  }

  return data || [];
}

/* ================================
   PAGE
================================ */

export default async function SettingsPage() {
  const supabase = await createClient();

  const [users, companies, branches, departments, roles, designations] =
    await Promise.all([
      getUsers(supabase),
      getCompanies(supabase),
      getBranches(supabase),
      getDepartments(supabase),
      getRoles(supabase),
      getDesignations(supabase),
    ]);

  return (
    <div>
      <Settings
        users={users}
        companies={companies}
        branches={branches}
        department={departments}
        roles={roles}
        designations={designations}
      />
    </div>
  );
}
