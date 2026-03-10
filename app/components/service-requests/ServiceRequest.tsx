import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function ServiceRequest() {
  const stats = [
    {
      title: "Total Requests",
      value: "0",
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "Submitted",
      value: "0",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: "0",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: "0",
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Service Requests
        </h1>
        <p className="text-slate-500">
          Manage and track all your service requests in one place
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-8">
        <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Service Request
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-slate-900">
              All Services
            </CardTitle>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search requests..."
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#2B3A9F] hover:border-[#2B3A9F]/30"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="cursor-pointer focus:bg-[#2B3A9F]/10 focus:text-[#2B3A9F]">
                    All Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-amber-50 focus:text-amber-700">
                    Submitted
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-emerald-50 focus:text-emerald-700">
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-rose-50 focus:text-rose-700">
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-slate-500 font-medium">
                  Request ID
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Service Type
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Date Submitted
                </TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Empty State */}
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium text-slate-600 mb-1">
                      No service requests found
                    </p>
                    <p className="text-sm">
                      Create your first service request to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
