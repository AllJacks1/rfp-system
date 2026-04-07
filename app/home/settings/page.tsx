"use server";
import Settings from "@/app/components/settings/Settings";
import {
  CreateUserPayload,
  Department,
  FlattendUser,
  UserAssignmentRow,
} from "@/lib/interfaces";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

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

export async function createUserAction(payload: CreateUserPayload) {
  const supabaseAdmin = getSupabaseAdmin();

  const {
    email,
    password,
    username,
    first_name,
    middle_name,
    last_name,
    mobile_number,
    address,
    birthday,
    sex,
    company_id,
    branch_id,
    department_id,
    designation_id,
    role_id,
  } = payload;

  let auth_user_id: string | null = null;
  let user_id: string | null = null;

  try {
    /* ================================
       1. CREATE AUTH USER
    ================================= */
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw new Error(authError.message);

    auth_user_id = authData.user.id;

    /* ================================
       2. INSERT INTO public.users
    ================================= */
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          username,
          first_name,
          middle_name: middle_name || null,
          last_name,
          email,
          mobile_number: mobile_number || null,
          address: address || null,
          birthday: birthday || null,
          sex: sex || null,
          auth_user_id,
        },
      ])
      .select()
      .single();

    if (userError) throw new Error(userError.message);

    user_id = userData.user_id;

    /* ================================
       3. INSERT INTO user_assignments
    ================================= */
    const { error: assignError } = await supabaseAdmin
      .from("user_assignments")
      .insert([
        {
          user_id,
          company_id,
          branch_id,
          department_id,
          designation_id,
          role_id,
        },
      ]);

    if (assignError) throw new Error(assignError.message);

    /* ================================
       4. REVALIDATE
    ================================= */
    revalidatePath("/settings");

    return userData;
  } catch (error: unknown) {
    let errorMessage = "Failed to create user";
    if (error instanceof Error) {
      console.error("Create user failed:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Create user failed:", error);
    }

    /* ================================
       🔁 ROLLBACK LOGIC
    ================================= */

    // If assignment failed → delete user + auth
    if (user_id) {
      await supabaseAdmin.from("users").delete().eq("user_id", user_id);
    }

    // If user insert failed → delete auth
    if (auth_user_id) {
      await supabaseAdmin.auth.admin.deleteUser(auth_user_id);
    }

    throw new Error(errorMessage);
  }
}

export async function updateUserAction(
  payload: CreateUserPayload & { user_id: string },
) {
  const supabaseAdmin = getSupabaseAdmin();

  const {
    user_id,
    email,
    password, // optional
    username,
    first_name,
    middle_name,
    last_name,
    mobile_number,
    address,
    birthday,
    sex,
    company_id,
    branch_id,
    department_id,
    designation_id,
    role_id,
  } = payload;

  try {
    /* ================================
       1. GET AUTH USER ID
    ================================= */
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("auth_user_id")
      .eq("user_id", user_id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const auth_user_id = existingUser.auth_user_id;

    /* ================================
       2. UPDATE AUTH (optional)
    ================================= */
    if (auth_user_id && (email || password)) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(auth_user_id, {
          email,
          password: password || undefined,
        });

      if (authError) throw new Error(authError.message);
    }

    /* ================================
       3. UPDATE public.users
    ================================= */
    const { data: updatedUser, error: userError } = await supabaseAdmin
      .from("users")
      .update({
        username,
        first_name,
        middle_name: middle_name || null,
        last_name,
        email,
        mobile_number: mobile_number || null,
        address: address || null,
        birthday: birthday || null,
        sex: sex || null,
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (userError) throw new Error(userError.message);

    /* ================================
       4. UPDATE user_assignments
    ================================= */
    const { error: assignError } = await supabaseAdmin
      .from("user_assignments")
      .update({
        company_id,
        branch_id,
        department_id,
        designation_id,
        role_id,
      })
      .eq("user_id", user_id);

    if (assignError) throw new Error(assignError.message);

    /* ================================
       5. REVALIDATE
    ================================= */
    revalidatePath("/settings");

    return updatedUser;
  } catch (error: unknown) {
    let errorMessage = "Failed to update user";

    if (error instanceof Error) {
      console.error("Update user failed:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Update user failed:", error);
    }

    throw new Error(errorMessage);
  }
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
        onCreate={createUserAction}
        onEdit={updateUserAction}
      />
    </div>
  );
}
