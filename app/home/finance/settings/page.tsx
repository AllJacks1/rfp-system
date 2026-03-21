import FinanceSettings from "@/app/components/settings/FinanceSettings";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

async function getAccounts(supabase: SupabaseClient) {
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

async function getTypes(supabase: SupabaseClient) {
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

async function getUnits(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("units")
    .select("unit_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching unit:", error);
    return [];
  }

  return data || [];
}

async function getVehicles(supabase: SupabaseClient) {
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

async function getVendors(supabase: SupabaseClient) {
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

async function getBanks(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("banks")
    .select("bank_id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching banks:", error);
    return [];
  }

  return data || [];
}

async function getPaymentMethods(supabase: SupabaseClient) {
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

export default async function FinanceSettingsPage() {
  const supabase = await createClient();

  const [accounts, types, units, vehicles, vendors, banks, paymentMethods] =
    await Promise.all([
      getAccounts(supabase),
      getTypes(supabase),
      getUnits(supabase),
      getVehicles(supabase),
      getVendors(supabase),
      getBanks(supabase),
      getPaymentMethods(supabase),
    ]);

  return (
    <div>
      <FinanceSettings
        accounts={accounts}
        types={types}
        units={units}
        vehicles={vehicles}
        vendors={vendors}
        banks={banks}
        methods={paymentMethods}
      />
    </div>
  );
}
