import CreateServiceRequestForm from "@/app/components/service-requests/CreateServiceRequestForm";
import { Department } from "@/lib/interfaces";
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

  return data || [];
}

async function getCompanies(supabase: any) {
  const { data, error } = await supabase
    .from("companies")
    .select("company_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching types:", error);
    return [];
  }

  return data || [];
}

async function getDepartments(supabase: any): Promise<Department[]> {
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
    data?.flatMap((department: any) => {
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

      return branches.map((branch: any) => {
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

async function getVehicles(supabase: any) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "vehicle_id, plate_number, car_type, owners_first_name, owners_last_name",
    )
    .order("plate_number", { ascending: true });

  if (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }

  return data || [];
}

async function getVendors(supabase: any) {
  const { data, error } = await supabase
    .from("vendors")
    .select("vendor_id, name, contact_person, payment_terms")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }

  return data || [];
}

async function getPaymentMethods(supabase: any) {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("payment_method_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }

  return data || [];
}

async function getunits(supabase: any) {
  const { data, error } = await supabase
    .from("units")
    .select("unit_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching units:", error);
    return [];
  }

  return data || [];
}

export default async function CreateServiceRequestPage() {
  const supabase = await createClient();

  const types = await getTypes(supabase);
  const companies = await getCompanies(supabase);
  const departments = await getDepartments(supabase);
  const vehicles = await getVehicles(supabase);
  const vendors = await getVendors(supabase);
  const paymentMethods = await getPaymentMethods(supabase);
  const units = await getunits(supabase);

  return (
    <div>
      <CreateServiceRequestForm
        types={types}
        companies={companies}
        departments={departments}
        vehicles={vehicles}
        vendors={vendors}
        paymentMethods={paymentMethods}
        units={units}
      />
    </div>
  );
}
