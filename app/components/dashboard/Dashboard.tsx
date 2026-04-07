import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShoppingCart,
  ClipboardList,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Wallet,
  Receipt,
  BarChart3,
  XCircle,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

// --- Your Existing Interfaces (preserve these) ---

export interface ModuleSummary {
  rfpTotal: number;
  rfpPending: number;
  rfpApproved: number;
  rfpRejected: number;
  liqTotal: number;
  liqPending: number;
  liqApproved: number;
  liqRejected: number;
  SOTotal: number;
  SOPending: number;
  SOApproved: number;
  SORejected: number;
  POTotal: number;
  POPending: number;
  POApproved: number;
  PORejected: number;
  SRTotal: number;
  SRPending: number;
  SRApproved: number;
  SRRejected: number;
  PRTotal: number;
  PRPending: number;
  PRApproved: number;
  PRRejected: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  status: string;
  created_at: string;
  user: string;
}

export interface DashboardProps {
  moduleSummary: ModuleSummary;
  recentActivities: RecentActivity[];
}

// --- Internal Types ---

type ModuleKey = "rfp" | "liq" | "SO" | "PO" | "SR" | "PR";

interface ModuleConfig {
  key: ModuleKey;
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

interface ModuleStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// --- Static Configuration ---

const MODULES: ModuleConfig[] = [
  {
    key: "rfp",
    title: "Requests for Payment",
    href: "/home/finance/request-for-payment",
    icon: CreditCard,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-500",
    description: "Payment approvals and processing",
  },
  {
    key: "liq",
    title: "Liquidation",
    href: "/home/finance/liquidation",
    icon: Receipt,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-500",
    description: "Expense reimbursements pending",
  },
  {
    key: "SO",
    title: "Service Orders",
    href: "/home/finance/service-orders",
    icon: CheckCircle2,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
    description: "Ongoing service agreements",
  },
  {
    key: "PO",
    title: "Purchase Orders",
    href: "/home/finance/purchase-orders",
    icon: ClipboardList,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    description: "Active orders awaiting delivery",
  },
  {
    key: "SR",
    title: "Service Requests",
    href: "/home/finance/service-requests",
    icon: FileText,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-500",
    description: "Service approvals and scheduling",
  },
  {
    key: "PR",
    title: "Purchase Requests",
    href: "/home/finance/purchase-requests",
    icon: ShoppingCart,
    color: "text-[#2B3A9F]",
    bgColor: "bg-[#2B3A9F]/10",
    borderColor: "border-[#2B3A9F]",
    description: "Pending approvals and new requests",
  },
];

// --- Helpers ---

function getModuleStats(summary: ModuleSummary, key: ModuleKey): ModuleStats {
  return {
    total: summary[`${key}Total` as keyof ModuleSummary] as number,
    pending: summary[`${key}Pending` as keyof ModuleSummary] as number,
    approved: summary[`${key}Approved` as keyof ModuleSummary] as number,
    rejected: summary[`${key}Rejected` as keyof ModuleSummary] as number,
  };
}

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
  if (diffInSeconds < 3600)
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  if (diffInSeconds < 86400)
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  if (diffInSeconds < 604800)
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  if (diffInSeconds < 2592000)
    return rtf.format(-Math.floor(diffInSeconds / 604800), "week");
  if (diffInSeconds < 31536000)
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
}

function calcApprovalRate(stats: ModuleStats): number {
  const total = stats.approved + stats.pending + stats.rejected;
  return total > 0 ? Math.round((stats.approved / total) * 100) : 0;
}

// --- Sub-components ---

function StatCard({
  title,
  value,
  icon: Icon,
  badge,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  badge?: string;
  variant?: "default" | "primary";
}) {
  if (variant === "primary") {
    return (
      <Card className="border-0 shadow-sm bg-gradient-to-br from-[#2B3A9F] to-[#1e2a6f] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon className="h-24 w-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">{title}</p>
              <p className="text-4xl font-bold">{value}</p>
              {badge && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0 mt-3"
                >
                  {badge}
                </Badge>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = title.includes("Approved");
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-4xl font-bold text-slate-900">{value}</p>
          </div>
          <div
            className={`p-3 rounded-xl ${isPositive ? "bg-emerald-50" : "bg-rose-50"}`}
          >
            <Icon
              className={`h-6 w-6 ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleCard({
  config,
  stats,
}: {
  config: ModuleConfig;
  stats: ModuleStats;
}) {
  const approvedPct = calcApprovalRate(stats);
  const pendingPct =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
  const rejectedPct =
    stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0;

  return (
    <Link href={config.href} className="group">
      <Card className="h-full border-0 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white overflow-hidden">
        <div
          className={`h-1 w-full ${config.borderColor} opacity-0 group-hover:opacity-100 transition-opacity`}
        />
        <CardContent className="p-5">
          <div
            className={`p-3 rounded-xl ${config.bgColor} w-fit mb-4 transition-transform group-hover:scale-110 duration-300`}
          >
            <config.icon className={`h-5 w-5 ${config.color}`} />
          </div>

          <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#2B3A9F] transition-colors text-lg">
            {config.title}
          </h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-1">
            {config.description}
          </p>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-slate-900">
              {stats.total}
            </span>
            <span className="text-sm text-slate-400">total</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">{stats.pending} pending</span>
              <span className="text-emerald-600">{approvedPct}% approved</span>
            </div>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${approvedPct}%` }}
              />
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${pendingPct}%` }}
              />
              <div
                className="bg-rose-400 transition-all duration-500"
                style={{ width: `${rejectedPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                Approved
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />{" "}
                Pending
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />{" "}
                Rejected
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityRow({ activity }: { activity: RecentActivity }) {
  const statusColors: Record<string, string> = {
    approved: "bg-emerald-500",
    rejected: "bg-rose-500",
    pending: "bg-amber-500",
  };

  const initials = activity.user
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="mt-1">
        <div
          className={`w-2.5 h-2.5 rounded-full ring-2 ring-white ${statusColors[activity.status] || "bg-slate-400"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2B3A9F] transition-colors">
            {activity.id}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            {getRelativeTime(activity.created_at)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2 font-medium">
          {activity.type}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600">
            {initials}
          </div>
          <span className="text-xs text-slate-600">{activity.user}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function Dashboard({
  moduleSummary,
  recentActivities,
}: DashboardProps) {
  // Calculate totals from flat moduleSummary
  const totals = MODULES.reduce(
    (acc, mod) => {
      const stats = getModuleStats(moduleSummary, mod.key);
      return {
        pending: acc.pending + stats.pending,
        approved: acc.approved + stats.approved,
        rejected: acc.rejected + stats.rejected,
      };
    },
    { pending: 0, approved: 0, rejected: 0 },
  );

  const approvalRate =
    totals.approved + totals.pending + totals.rejected > 0
      ? Math.round(
          (totals.approved /
            (totals.approved + totals.pending + totals.rejected)) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#2B3A9F]/10 rounded-2xl">
          <BarChart3 className="h-8 w-8 text-[#2B3A9F]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of all financial operations and pending approvals
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Pending Approvals"
          value={totals.pending}
          icon={Wallet}
          variant="primary"
          badge={`${approvalRate}% approval rate`}
        />
        <StatCard
          title="Approved (MTD)"
          value={totals.approved}
          icon={CheckCircle2}
        />
        <StatCard
          title="Rejected (MTD)"
          value={totals.rejected}
          icon={XCircle}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Module Cards */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((config) => (
            <ModuleCard
              key={config.key}
              config={config}
              stats={getModuleStats(moduleSummary, config.key)}
            />
          ))}
        </div>

        {/* Sidebar */}
        <Card className="border-0 shadow-sm bg-white h-fit">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest transactions
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-0 font-medium"
              >
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivities.map((activity, idx) => (
                <ActivityRow key={idx} activity={activity} />
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-[#2B3A9F] hover:bg-[#2B3A9F]/5 font-medium"
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
