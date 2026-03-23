"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import { DataTableCard, Column } from "@/app/components/cards/DataTableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Request, ServiceOrderProps } from "@/lib/interfaces";

// Types (keep your existing interfaces)
interface ServiceOrder {
  id: string;
  orderTitle: string;
  serviceType: string;
  status: "pending" | "approved" | "rejected";
  dateUpdated: string;
  requestor: string;
  department: string;
  description: string;
  priority: "low" | "medium" | "high";
  approvedBy?: string;
  approvedDate?: string;
}

// Mock Data for Service Orders
const mockServiceOrders: ServiceOrder[] = [
  {
    id: "SO-2024-001",
    orderTitle: "Network Infrastructure Upgrade",
    serviceType: "IT Services",
    status: "pending",
    dateUpdated: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    description: "Upgrade office network to support 10Gbps",
    priority: "high",
  },
  {
    id: "SO-2024-002",
    orderTitle: "Office Cleaning Services",
    serviceType: "Facilities",
    status: "approved",
    dateUpdated: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    description: "Weekly deep cleaning for main office",
    priority: "medium",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-09",
  },
  {
    id: "SO-2024-003",
    orderTitle: "Security System Maintenance",
    serviceType: "Security",
    status: "pending",
    dateUpdated: "2024-03-08",
    requestor: "Mike Chen",
    department: "Operations",
    description: "Annual maintenance of CCTV and access control",
    priority: "high",
  },
  {
    id: "SO-2024-004",
    orderTitle: "Catering for Q1 Meeting",
    serviceType: "Catering",
    status: "rejected",
    dateUpdated: "2024-03-07",
    requestor: "Emily Davis",
    department: "Marketing",
    description: "Lunch catering for quarterly all-hands",
    priority: "low",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-07",
  },
  {
    id: "SO-2024-005",
    orderTitle: "HVAC Repair",
    serviceType: "Facilities",
    status: "approved",
    dateUpdated: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Operations",
    description: "Repair air conditioning in Conference Room B",
    priority: "high",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-06",
  },
  {
    id: "SO-2024-006",
    orderTitle: "Software Development Consulting",
    serviceType: "Professional Services",
    status: "pending",
    dateUpdated: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "Engineering",
    description: "External consulting for microservices architecture",
    priority: "medium",
  },
  {
    id: "SO-2024-007",
    orderTitle: "Employee Transport Service",
    serviceType: "Transportation",
    status: "approved",
    dateUpdated: "2024-03-04",
    requestor: "David Brown",
    department: "HR",
    description: "Shuttle service for night shift employees",
    priority: "medium",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-04",
  },
  {
    id: "SO-2024-008",
    orderTitle: "Event Management",
    serviceType: "Events",
    status: "rejected",
    dateUpdated: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Marketing",
    description: "Annual company retreat planning and execution",
    priority: "low",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-03",
  },
];

export default function ServiceOrder({ requests }: ServiceOrderProps) {
  const [orders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const router = useRouter();

  // New state for approved requests dialog
  const [approvedRequestsDialogOpen, setApprovedRequestsDialogOpen] =
    useState(false);

  const getStatusBadge = (status: ServiceOrder["status"]) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      rejected: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    };
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
    };
    return (
      <Badge className={styles[status]} variant="secondary">
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ServiceOrder["priority"]) => {
    const styles = {
      low: "bg-slate-100 text-slate-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
    };
    return (
      <Badge className={styles[priority]} variant="secondary">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleView = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleReviewRequests = () => {
    setApprovedRequestsDialogOpen(true);
  };

  const handleCreateServiceOrder = (request: Request) => {
    setApprovedRequestsDialogOpen(false);
    router.push(`/home/finance/service-orders/create-so/${request.id}`);
  };

  // Stats calculation
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "To be Approved",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: orders.filter((o) => o.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: orders.filter((o) => o.status === "rejected").length,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Define columns for Service Orders
  const columns: Column<ServiceOrder>[] = [
    { key: "id", header: "Order ID", width: "w-[140px]" },
    { key: "orderTitle", header: "Order Title", width: "min-w-[200px]" },
    { key: "serviceType", header: "Service Type", width: "w-[160px]" },
    {
      key: "requestor",
      header: "Requestor",
      width: "w-[140px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.requestor}</span>
          <span className="text-xs text-slate-500">{row.department}</span>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "w-[100px]",
      render: (row) => getPriorityBadge(row.priority),
    },
    {
      key: "status",
      header: "Status",
      width: "w-[110px]",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "dateUpdated",
      header: "Date Updated",
      width: "w-[130px]",
      render: (row) =>
        new Date(row.dateUpdated).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const filterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Service Orders
        </h1>
        <p className="text-slate-500">
          Manage and track all your service orders in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm bg-white">
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

      {/* Data Table Card */}
      <DataTableCard
        data={orders}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Service Orders"
        subtitle="View and manage your service orders"
        searchPlaceholder="Search orders..."
        searchable
        searchKeys={[
          "id",
          "orderTitle",
          "serviceType",
          "requestor",
          "department",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20"
            onClick={handleReviewRequests}
          >
            <Plus className="mr-2 h-4 w-4" />
            View Approved Service Requests
          </Button>
        }
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row)}
            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:text-[#2B3A9F] hover:border-[#2B3A9F]/30 hover:bg-[#2B3A9F]/5"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
        )}
      />

      {/* View Dialog for Service Order Details */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Service Order Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Full details for {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Order ID</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Service Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Priority</p>
                  <div className="mt-1">
                    {getPriorityBadge(selectedOrder.priority)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requestor
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.requestor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date Updated
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedOrder.dateUpdated).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                {selectedOrder.approvedBy && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {selectedOrder.status === "approved"
                        ? "Approved By"
                        : "Rejected By"}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedOrder.approvedBy}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {selectedOrder.description}
                </p>
              </div>
              {selectedOrder.approvedDate && (
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {selectedOrder.status === "approved"
                      ? "Approved Date"
                      : "Rejected Date"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedOrder.approvedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW: Approved Service Requests Dialog */}
      <Dialog
        open={approvedRequestsDialogOpen}
        onOpenChange={setApprovedRequestsDialogOpen}
      >
        <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header - Clean slate with subtle border */}
          <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900 tracking-tight">
                  Approved Service Requests
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select a request to create a new service order
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {requests.length} requests
              </Badge>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No approved requests
                </h3>
                <p className="text-sm text-slate-500">
                  There are no approved service requests available at this time.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-45">
                        Request ID
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-35">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 text-start w-40">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-sm text-slate-700 py-4">
                          {request.request_number}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900 py-4">
                          {request.title}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 py-4">
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-300 text-slate-600"
                          >
                            {request.service_category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            size="sm"
                            onClick={() => handleCreateServiceOrder(request)}
                            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white gap-2"
                          >
                            Create Service Order
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-slate-50">
            <div className="mb-4 mr-4">
              <Button
                variant="outline"
                onClick={() => setApprovedRequestsDialogOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Close
              </Button> 
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
