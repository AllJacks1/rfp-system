import CreateLiquidation from "@/app/components/liquidation/CreateLiquidation";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ rfpId: string }>;
}

async function getRFP(id: string, supabase: any) {
  const { data, error } = await supabase
    .from("requests_for_payment")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching units:", error);
    return [];
  }
  return data;
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

async function getAccounts(supabase: any) {
  const { data, error } = await supabase
    .from("chart_of_accounts")
    .select("account_id, account_type, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }

  return data || [];
}

export default async function CreateLiquidationPage({ params }: PageProps) {
  const { rfpId } = await params;
  const supabase = await createClient();

  const rfp = await getRFP(rfpId, supabase);
  const vehicles = await getVehicles(supabase);
  const accounts = await getAccounts(supabase);
  const vendors = await getVendors(supabase);

  return (
    <div>
      <CreateLiquidation
        rfp={rfp}
        vehicles={vehicles}
        accounts={accounts}
        vendors={vendors}
        module="employee-portal/requests"
      />
    </div>
  );
}
