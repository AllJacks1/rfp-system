"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Types
interface PurchaseOrder {
  id: string;
  orderTitle: string;
  purchaseType: string;
  status: "pending" | "approved" | "rejected";
  dateUpdated: string;
  requestor: string;
  department: string;
  amount: string;
  description: string;
  vendor: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Request type for the approved requests dialog
interface Request {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  company: string;
  department: string;
  amount: string;
  description: string;
  preferredVendor: string;
  vendorContactPerson: string;
  requiredBy: string;
  paymentMethod: string;
}

// Mock Data for Approved Purchase Requests
const mockRequests: Request[] = [
  {
    id: "REQ-2024-001",
    title: "Laptop Upgrades for Dev Team",
    type: "IT Equipment",
    priority: "High",
    status: "approved",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    company: "TechNova Solutions",
    department: "Engineering",
    amount: "$12,500",
    description:
      "Upgrade laptops for development team to handle heavier workloads.",
    preferredVendor: "Dell Technologies",
    vendorContactPerson: "Michael Reyes",
    requiredBy: "2024-03-25",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "REQ-2024-002",
    title: "Q1 Office Supplies",
    type: "Office Supplies",
    priority: "Medium",
    status: "approved",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    company: "TechNova Solutions",
    department: "Administration",
    amount: "$850",
    description: "Quarterly restocking of office supplies.",
    preferredVendor: "Office Warehouse",
    vendorContactPerson: "Ana Santos",
    requiredBy: "2024-03-15",
    paymentMethod: "Company Credit Card",
  },
  {
    id: "REQ-2024-003",
    title: "Adobe Creative Cloud Licenses",
    type: "Software License",
    priority: "High",
    status: "approved",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    company: "TechNova Solutions",
    department: "Design",
    amount: "$3,200",
    description: "Annual subscription for 10 design team members.",
    preferredVendor: "Adobe",
    vendorContactPerson: "Sales Team",
    requiredBy: "2024-03-20",
    paymentMethod: "Credit Card",
  },
  {
    id: "REQ-2024-004",
    title: "Server Rack and Networking Equipment",
    type: "Hardware",
    priority: "High",
    status: "approved",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    company: "TechNova Solutions",
    department: "Engineering",
    amount: "$8,750",
    description: "48U server rack with switches and cables.",
    preferredVendor: "Dell Technologies",
    vendorContactPerson: "Jane Smith",
    requiredBy: "2024-03-30",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "REQ-2024-005",
    title: "Trade Show Booth and Materials",
    type: "Marketing",
    priority: "Medium",
    status: "approved",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    company: "TechNova Solutions",
    department: "Marketing",
    amount: "$15,000",
    description: "10x10 booth, banners, and promotional items for TechExpo.",
    preferredVendor: "Expo Solutions LLC",
    vendorContactPerson: "Tom Wilson",
    requiredBy: "2024-04-15",
    paymentMethod: "Company Credit Card",
  },
];

// Mock Data for Purchase Orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-2024-001",
    orderTitle: "Laptop Upgrades for Dev Team",
    purchaseType: "IT Equipment",
    status: "pending",
    dateUpdated: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    amount: "$12,500",
    description: "15 MacBook Pro laptops for new developers",
    vendor: "Apple Inc.",
  },
  {
    id: "PO-2024-002",
    orderTitle: "Q1 Office Supplies Restock",
    purchaseType: "Office Supplies",
    status: "approved",
    dateUpdated: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    amount: "$850",
    description: "Paper, pens, folders, and other stationary",
    vendor: "Staples",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-09",
  },
  {
    id: "PO-2024-003",
    orderTitle: "Adobe Creative Cloud Licenses",
    purchaseType: "Software License",
    status: "pending",
    dateUpdated: "2024-03-08",
    requestor: "Mike Chen",
    department: "Design",
    amount: "$3,200",
    description: "Annual subscription for 10 design team members",
    vendor: "Adobe",
  },
  {
    id: "PO-2024-004",
    orderTitle: "Q2 Marketing Strategy Consulting",
    purchaseType: "Consulting Services",
    status: "rejected",
    dateUpdated: "2024-03-07",
    requestor: "Emily Davis",
    department: "Marketing",
    amount: "$25,000",
    description: "External marketing firm for campaign strategy",
    vendor: "McKinsey & Company",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-07",
  },
  {
    id: "PO-2024-005",
    orderTitle: "Server Rack and Networking Equipment",
    purchaseType: "Hardware",
    status: "approved",
    dateUpdated: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Engineering",
    amount: "$8,750",
    description: "48U server rack with switches and cables",
    vendor: "Dell Technologies",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-06",
  },
  {
    id: "PO-2024-006",
    orderTitle: "Leadership Development Program",
    purchaseType: "Training",
    status: "pending",
    dateUpdated: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "HR",
    amount: "$5,000",
    description: "Executive coaching for senior managers",
    vendor: "FranklinCovey",
  },
  {
    id: "PO-2024-007",
    orderTitle: "Trade Show Booth and Materials",
    purchaseType: "Marketing",
    status: "approved",
    dateUpdated: "2024-03-04",
    requestor: "David Brown",
    department: "Marketing",
    amount: "$15,000",
    description: "10x10 booth, banners, and promotional items for TechExpo",
    vendor: "Expo Solutions LLC",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-04",
  },
  {
    id: "PO-2024-008",
    orderTitle: "Office Renovation Phase 1",
    purchaseType: "Facilities",
    status: "rejected",
    dateUpdated: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Operations",
    amount: "$45,000",
    description: "Flooring and lighting upgrade for 3rd floor",
    vendor: "BuildRight Construction",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-03",
  },
];

export default function PurchaseOrder() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // New state for approved requests dialog
  const [approvedRequestsDialogOpen, setApprovedRequestsDialogOpen] =
    useState(false);

  const getStatusBadge = (status: PurchaseOrder["status"]) => {
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

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleReviewRequests = () => {
    setApprovedRequestsDialogOpen(true);
  };

  const handleCreatePurchaseOrder = (request: Request) => {
    // Logic to create purchase order from approved request
    console.log("Creating purchase order from request:", request.id);
    // You can add navigation or modal opening here
    setApprovedRequestsDialogOpen(false);
  };

  // Filter approved requests
  const approvedRequests = mockRequests.filter(
    (req) => req.status === "approved",
  );

  // Stats calculation
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: FileText,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
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

  // Define columns for Purchase Orders
  const columns: Column<PurchaseOrder>[] = [
    { key: "id", header: "Order ID", width: "w-[140px]" },
    { key: "orderTitle", header: "Order Title", width: "min-w-[200px]" },
    { key: "purchaseType", header: "Purchase Type", width: "w-[180px]" },
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
    { key: "amount", header: "Amount", width: "w-[100px]" },
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
          Purchase Orders
        </h1>
        <p className="text-slate-500">
          Manage and track all your purchase orders in one place
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

      {/* Data Table Card - Only View Action */}
      <DataTableCard
        data={orders}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Purchase Orders"
        subtitle="View and manage your purchase orders"
        searchPlaceholder="Search orders..."
        searchable
        searchKeys={[
          "id",
          "orderTitle",
          "purchaseType",
          "requestor",
          "department",
          "vendor",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white"
            onClick={handleReviewRequests}
          >
            <Plus className="mr-2 h-4 w-4" />
            View Approved Purchase Requests
          </Button>
        }
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row)}
            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
        )}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Purchase Order Details
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
                    Purchase Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.purchaseType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vendor</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.vendor}
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

      {/* NEW: Approved Purchase Requests Dialog */}
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
                  Approved Purchase Requests
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select a request to create a new purchase order
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {approvedRequests.length} requests
              </Badge>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            {approvedRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No approved requests
                </h3>
                <p className="text-sm text-slate-500">
                  There are no approved purchase requests available at this
                  time.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-[180px]">
                        Request ID
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-[140px]">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 text-start w-[160px]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-sm text-slate-700 py-4">
                          {request.id}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900 py-4">
                          {request.title}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 py-4">
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-300 text-slate-600"
                          >
                            {request.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            size="sm"
                            onClick={() => handleCreatePurchaseOrder(request)}
                            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white gap-2"
                          >
                            Create Purchase Order
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
