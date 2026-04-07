"use server";
import { createClient } from "@/lib/supabase/server";
import HomePageClient from "../components/dashboard/HomePageClient";
import { ModuleSummary } from "@/lib/interfaces";

async function getModuleStats(supabase: any): Promise<ModuleSummary> {
  const [
    rfp,
    liq,
    so,
    po,
    sr,
    pr
  ] = await Promise.all([
    getStatusCounts(supabase, "requests_for_payment"),
    getStatusCounts(supabase, "liquidations"),
    getStatusCounts(supabase, "service_orders"),
    getStatusCounts(supabase, "purchase_orders"),
    getStatusCounts(supabase, "service_requests"),
    getStatusCounts(supabase, "purchase_requests"),
  ]);

  return {
    rfpTotal: rfp.length,
    rfpPending: getStatusCount(rfp, "for approval"),
    rfpApproved: getStatusCount(rfp, "approved"),
    rfpRejected: getStatusCount(rfp, "rejected"),

    liqTotal: liq.length,
    liqPending: getStatusCount(liq, "submitted"),
    liqApproved: getStatusCount(liq, "approved"),
    liqRejected: getStatusCount(liq, "rejected"),

    SOTotal: so.length,
    SOPending: getStatusCount(so, "for approval"),
    SOApproved: getStatusCount(so, "approved"),
    SORejected: getStatusCount(so, "rejected"),

    POTotal: po.length,
    POPending: getStatusCount(po, "for approval"),
    POApproved: getStatusCount(po, "approved"),
    PORejected: getStatusCount(po, "rejected"),

    SRTotal: sr.length,
    SRPending: getStatusCount(sr, "for review"),
    SRApproved: getStatusCount(sr, "approved"),
    SRRejected: getStatusCount(sr, "rejected"),

    PRTotal: pr.length,
    PRPending: getStatusCount(pr, "for review"),
    PRApproved: getStatusCount(pr, "approved"),
    PRRejected: getStatusCount(pr, "rejected"),
  };
}

// Helper function to get counts by status
async function getStatusCounts(supabase: any, table: string) {
  const { data, error } = await supabase.from(table).select("status");

  if (error || !data) {
    console.error(`Error fetching ${table}:`, error);
    return {};
  }

  return data;

}

function getStatusCount(items: any[], status: string) {
  return items.filter((item) => item.status === status).length;
}

export default async function HomePage() {
  const supabase = await createClient();
  const stats = await getModuleStats(supabase);

  console.log("Module Summary:", stats);

  return <HomePageClient moduleSummary={stats} recentActivities={[]} />;
}
