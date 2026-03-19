import Settings from "@/app/components/settings/Settings";
import { Department, FlattendUser, UserAssignmentRow } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";

async function getUsers(): Promise<FlattendUser[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_assignments")
    .select(
      `
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
    `,
    )
    .order("first_name", { foreignTable: "users", ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  const rows = (data || []) as unknown as UserAssignmentRow[];

  const flattendData: FlattendUser[] = rows.map((row) => ({
    user_id: row.users.user_id,
    first_name: row.users.first_name,
    middle_name: row.users.middle_name,
    last_name: row.users.last_name,
    email: row.users.email ?? "",
    mobile_number: row.users.mobile_number,
    address: row.users.address,
    birthday: row.users.birthday,
    sex: row.users.sex,

    role_id: row.roles.role_id,
    role_name: row.roles.name,

    designation_id: row.designations.designation_id,
    designation_name: row.designations.name,

    company_id: row.companies.company_id,
    company_name: row.companies.name,

    branch_id: row.branches.branch_id,
    branch_location: row.branches.location,

    department_id: row.departments.department_id,
    department_name: row.departments.name,
  }));

  console.log(JSON.stringify(flattendData));
  return flattendData;
}

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

async function getRoles() {
  const supabase = await createClient();

  const { data: roles, error } = await supabase
    .from("roles")
    .select("role_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }

  return roles || [];
}

async function getDesignations() {
  const supabase = await createClient();

  const { data: designations, error } = await supabase
    .from("designations")
    .select("designation_id, name, scope")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching designations:", error);
    return [];
  }

  return designations || [];
}

export default async function SettingsPage() {
  const users = await getUsers();
  const companies = await getCompanies();
  const branches = await getBranches();
  const departments = await getDepartments();
  const roles = await getRoles();
  const designations = await getDesignations();

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
