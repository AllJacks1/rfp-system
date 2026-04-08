"use server";
import { createClient } from "@/lib/supabase/server";
import HomePageClient from "../components/dashboard/HomePageClient";
import { ModuleSummary, RecentActivity } from "@/lib/interfaces";

async function getModuleStats(supabase: any): Promise<ModuleSummary> {
  const [rfp, liq, so, po, sr, pr] = await Promise.all([
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

async function getRecentActivities(supabase: any): Promise<RecentActivity[]> {
  const [
    { data: srData, error: srError },
    { data: prData, error: prError },
    { data: soData, error: soError },
    { data: poData, error: poError },
    { data: rfpData, error: rfpError },
    { data: liqData, error: liqError },
  ] = await Promise.all([
    supabase
      .from("service_requests")
      .select(
        `
        request_number,
        created_at,
        status,
        user:users(first_name, last_name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),

    supabase
      .from("purchase_requests")
      .select(
        `
        request_number,
        created_at,
        status,
        user:users(first_name, last_name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),

    supabase
      .from("service_orders")
      .select(
        `
        order_number,
        created_at,
        status,
        user:users(first_name, last_name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),

    supabase
      .from("purchase_orders")
      .select(
        `
        order_number,
        created_at,
        status,
        user:users(first_name, last_name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),

    supabase
      .from("requests_for_payment")
      .select(
        `
        rfp_number,
        created_at,
        status
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),

    supabase
      .from("liquidations")
      .select(
        `
        liquidation_number,
        created_at,
        status
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (srError || prError || soError || poError || rfpError || liqError) {
    console.error("Error fetching activities");
    return [];
  }

  const formatUser = (u: any) =>
    u ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() : "Unknown";

  const activities: RecentActivity[] = [
    ...(srData ?? []).map((r: any) => ({
      id: r.request_number,
      type: "Service Request",
      status: r.status,
      created_at: r.created_at,
      user: formatUser(r.user),
    })),

    ...(prData ?? []).map((r: any) => ({
      id: r.request_number,
      type: "Purchase Request",
      status: r.status,
      created_at: r.created_at,
      user: formatUser(r.user),
    })),

    ...(soData ?? []).map((r: any) => ({
      id: r.order_number,
      type: "Service Order",
      status: r.status,
      created_at: r.created_at,
      user: formatUser(r.user),
    })),

    ...(poData ?? []).map((r: any) => ({
      id: r.order_number,
      type: "Purchase Order",
      status: r.status,
      created_at: r.created_at,
      user: formatUser(r.user),
    })),

    ...(rfpData ?? []).map((r: any) => ({
      id: r.rfp_number,
      type: "Request For Payment",
      status: r.status,
      created_at: r.created_at,
      user: "Unknown",
    })),

    ...(liqData ?? []).map((r: any) => ({
      id: r.liquidation_number,
      type: "Liquidation",
      status: r.status,
      created_at: r.created_at,
      user: "Unknown",
    })),
  ];

  return activities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
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
  const recentActivities = await getRecentActivities(supabase);

  return <HomePageClient moduleSummary={stats} recentActivities={recentActivities} />;
}
