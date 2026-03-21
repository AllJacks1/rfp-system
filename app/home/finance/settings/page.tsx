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

export default async function FinanceSettingsPage() {
  const supabase = await createClient();

  const [accounts] = await Promise.all([getAccounts(supabase)]);

  return (
    <div>
      <FinanceSettings accounts={accounts}/>
    </div>
  );
}
