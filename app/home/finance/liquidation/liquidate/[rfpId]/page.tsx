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

export default async function CreateLiquidationPage({ params }: PageProps) {
  const { rfpId } = await params;
  const supabase = await createClient();

  const rfp = await getRFP(rfpId, supabase);

  return (
    <div>
      <CreateLiquidation rfp={rfp}/>
    </div>
  );
}
