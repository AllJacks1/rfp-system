import Liquidation from "@/app/components/liquidation/Liquidation";
import { createClient } from "@/lib/supabase/server";

async function getApprovedRFPs(supabase: any, requestor: string) {
  const { data, error } = await supabase
    .from("requests_for_payment")
    .select("*")
    .eq("requested_by", requestor)
    .eq("status", "approved")
    .order("rfp_number", { ascending: true });

  if (error) {
    console.error("Error fetching RFPs:", error);
    return [];
  }

  return data || [];
}

async function getLiquidatedRFPs(supabase: any, requestor: string) {
  const { data, error } = await supabase
    .from("liquidations")
    .select("*")
    .eq("requested_by", requestor)
    .order("liquidation_number", { ascending: true });

  if (error) {
    console.error("Error fetching liquidated RFPs:", error);
    return [];
  }

  return data || [];
}

export default async function LiquidationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestor = user?.user_metadata?.full_name;

  const rfps = await getApprovedRFPs(supabase, requestor);
  const liquidations = await getLiquidatedRFPs(supabase, requestor);

  return (
    <div>
      <Liquidation rfps={rfps} liquidatedRFPs={liquidations} module="employee-portal/requests"/>
    </div>
  );
}
