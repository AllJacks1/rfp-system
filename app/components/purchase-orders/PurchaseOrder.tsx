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
import { Plus, FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
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
    // Navigate to review page or open review modal
    console.log("Review Purchase Requests clicked");
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
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20"
            onClick={handleReviewRequests}
          >
            <Plus className="mr-2 h-4 w-4" />
            Review Purchase Requests
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
    </div>
  );
}
