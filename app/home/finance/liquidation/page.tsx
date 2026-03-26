import Liquidation from '@/app/components/liquidation/Liquidation'
import { createClient } from '@/lib/supabase/server';

async function getApprovedRFPs(supabase: any) {
  const { data, error } = await supabase
    .from("requests_for_payment")
    .select("*")
    .eq("status", "approved")
    .order("rfp_number", { ascending: true });

  if (error) {
    console.error("Error fetching RFPs:", error);
    return [];
  }

  return data || [];
}

export default async function LiquidationPage() {
  const supabase = await createClient();

  const rfps = await getApprovedRFPs(supabase);

  return (
    <div><Liquidation rfps={rfps}/></div>
  )
}
