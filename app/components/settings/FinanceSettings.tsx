import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BookOpen,
  Car,
  Truck,
  Store,
  Landmark,
  CreditCard,
  Receipt,
  Wallet,
  FileSpreadsheet,
  TrendingUp,
  ChevronRight,
  Calculator,
  Building,
} from "lucide-react";
import Link from "next/link";

interface FinanceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  count?: string;
}

const financeCategories: FinanceCardProps[] = [
  {
    title: "Chart of Accounts",
    description:
      "Manage account titles, categories, and financial classifications",
    icon: BookOpen,
    href: "/finance/chart-of-accounts",
    color: "text-[#2B3A9F]",
    bgColor: "bg-[#2B3A9F]/10",
    count: "24 accounts",
  },
  {
    title: "Asset Vehicles",
    description: "Track partner vehicles",
    icon: Car,
    href: "/finance/assets",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    count: "12 assets",
  },
  {
    title: "Suppliers & Vendors",
    description: "Suppliers management, Vendor management and payment terms",
    icon: Store,
    href: "/finance/suppliers",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    count: "45 suppliers",
  },
  {
    title: "Banks & Institutions",
    description: "Configure bank accounts",
    icon: Landmark,
    href: "/finance/banks",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    count: "3 banks",
  },
  {
    title: "Payment Methods",
    description: "Setup credit cards, digital wallets, and payment gateways",
    icon: CreditCard,
    href: "/finance/payment-methods",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    count: "6 methods",
  },
];

export default function FinanceSettings() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Finance Settings</h1>
        <p className="text-slate-500 max-w-2xl">
          Configure chart of accounts, manage assets, vendors, and financial
          data structures
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 mb-1">Total Accounts</p>
            <p className="text-2xl font-bold text-[#2B3A9F]">156</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 mb-1">Active Vendors</p>
            <p className="text-2xl font-bold text-emerald-600">45</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 mb-1">Partner Vehicles</p>
            <p className="text-2xl font-bold text-amber-600">20</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 mb-1">Bank Accounts</p>
            <p className="text-2xl font-bold text-cyan-600">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {financeCategories.map((category) => (
          <Link key={category.title} href={category.href} className="group">
            <Card className="h-full border-0 shadow-sm hover:shadow-xl hover:shadow-[#2B3A9F]/10 transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-[#2B3A9F] bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-xl ${category.bgColor} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {category.count && (
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {category.count}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#2B3A9F] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#2B3A9F] transition-colors">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-slate-500 leading-relaxed text-sm">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
