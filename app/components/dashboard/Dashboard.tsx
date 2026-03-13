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
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  ClipboardList,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  BarChart3,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface ModuleSummary {
  title: string;
  href: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  trend?: number;
  amount?: string;
}

const moduleData: ModuleSummary[] = [
  {
    title: "Requests for Payment",
    href: "/home/finance/request-for-payment",
    total: 45,
    pending: 15,
    approved: 28,
    rejected: 2,
    icon: CreditCard,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-500",
    description: "Payment approvals and processing",
    trend: 15,
    amount: "₱2.1M",
  },
  {
    title: "Liquidation",
    href: "/home/finance/liquidation",
    total: 22,
    pending: 6,
    approved: 14,
    rejected: 2,
    icon: Receipt,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-500",
    description: "Expense reimbursements pending",
    amount: "₱340K",
  },
  {
    title: "Service Orders",
    href: "/home/finance/service-orders",
    total: 15,
    pending: 4,
    approved: 10,
    rejected: 1,
    icon: CheckCircle2,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
    description: "Ongoing service agreements",
    amount: "₱280K",
  },
  {
    title: "Purchase Orders",
    href: "/home/finance/purchase-orders",
    total: 18,
    pending: 5,
    approved: 12,
    rejected: 1,
    icon: ClipboardList,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    description: "Active orders awaiting delivery",
    trend: 8,
    amount: "₱856K",
  },
  {
    title: "Service Requests",
    href: "/home/finance/service-requests",
    total: 32,
    pending: 12,
    approved: 18,
    rejected: 2,
    icon: FileText,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-500",
    description: "Service approvals and scheduling",
    trend: -5,
    amount: "₱420K",
  },
  {
    title: "Purchase Requests",
    href: "/home/finance/purchase-requests",
    total: 24,
    pending: 8,
    approved: 14,
    rejected: 2,
    icon: ShoppingCart,
    color: "text-[#2B3A9F]",
    bgColor: "bg-[#2B3A9F]/10",
    borderColor: "border-[#2B3A9F]",
    description: "Pending approvals and new requests",
    trend: 12,
    amount: "₱1.2M",
  },
];

const recentActivity = [
  {
    id: "PR-2024-001",
    type: "Purchase Request",
    status: "pending",
    amount: "₱125,000",
    date: "2 hours ago",
    user: "John Doe",
  },
  {
    id: "PO-2024-015",
    type: "Purchase Order",
    status: "approved",
    amount: "₱89,500",
    date: "4 hours ago",
    user: "Jane Smith",
  },
  {
    id: "RFP-2024-008",
    type: "Request for Payment",
    status: "approved",
    amount: "₱45,000",
    date: "5 hours ago",
    user: "Mike Johnson",
  },
  {
    id: "SR-2024-003",
    type: "Service Request",
    status: "rejected",
    amount: "₱12,000",
    date: "Yesterday",
    user: "Sarah Lee",
  },
];

export default function Dashboard() {
  const totalPending = moduleData.reduce((acc, mod) => acc + mod.pending, 0);
  const totalApproved = moduleData.reduce((acc, mod) => acc + mod.approved, 0);
  const totalRejected = moduleData.reduce((acc, mod) => acc + mod.rejected, 0);
  const approvalRate = Math.round(
    (totalApproved / (totalApproved + totalPending + totalRejected)) * 100,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
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
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Primary Metric */}
        <Card className="border-0 shadow-sm bg-linear-to-br from-[#2B3A9F] to-[#1e2a6f] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="h-24 w-24" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Pending Approvals
                </p>
                <p className="text-4xl font-bold">{totalPending}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    {approvalRate}% approval rate
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Approved (MTD)
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {totalApproved}
                </p>
                <div className="flex items-center gap-1 mt-3 text-emerald-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8.2% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Rejected (MTD)
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {totalRejected}
                </p>
                <div className="flex items-center gap-1 mt-3 text-rose-600 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+2 from last month</span>
                </div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <XCircle className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Overview Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Module Cards */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleData.map((module) => {
            const approvedPct = Math.round(
              (module.approved / module.total) * 100,
            );
            const pendingPct = Math.round(
              (module.pending / module.total) * 100,
            );
            const rejectedPct = Math.round(
              (module.rejected / module.total) * 100,
            );

            return (
              <Link key={module.title} href={module.href} className="group">
                <Card className="h-full border-0 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white overflow-hidden">
                  {/* Top accent border */}
                  <div
                    className={`h-1 w-full ${module.borderColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-3 rounded-xl ${module.bgColor} transition-transform group-hover:scale-110 duration-300`}
                      >
                        <module.icon className={`h-5 w-5 ${module.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {module.trend && (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center ${
                              module.trend > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {module.trend > 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            )}
                            {Math.abs(module.trend)}%
                          </span>
                        )}
                        <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-[#2B3A9F]/10 transition-colors">
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#2B3A9F] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#2B3A9F] transition-colors text-lg">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                      {module.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">
                          {module.total}
                        </span>
                        <span className="text-sm text-slate-400">total</span>
                      </div>
                      {module.amount && (
                        <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                          {module.amount}
                        </span>
                      )}
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">
                          {module.pending} pending
                        </span>
                        <span className="text-emerald-600">
                          {approvedPct}% approved
                        </span>
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
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Approved
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Pending
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Rejected
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm bg-white">
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
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className="mt-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          activity.status === "approved"
                            ? "bg-emerald-500"
                            : activity.status === "rejected"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2B3A9F] transition-colors">
                          {activity.id}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">
                          {activity.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">
                        {activity.type}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-xs text-slate-600">
                            {activity.user}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {activity.amount}
                        </span>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}
