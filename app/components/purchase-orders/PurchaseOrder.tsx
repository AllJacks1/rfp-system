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
import {
  colors,
  Item,
  Order,
  PurchaseOrderProps,
  Request,
} from "@/lib/interfaces";
import { cn } from "@/lib/utils";

export default function PurchaseOrder({
  requests,
  orders,
  units,
}: PurchaseOrderProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // New state for approved requests dialog
  const [approvedRequestsDialogOpen, setApprovedRequestsDialogOpen] =
    useState(false);

  const getStatusBadge = (status: string) => {
    const config =
      colors.semantic[status as keyof typeof colors.semantic] ||
      colors.semantic.for_approval;
    const label =
      status === "for approval"
        ? "For Approval"
        : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <Badge
        className={cn(
          config.bg,
          config.text,
          "border",
          config.border,
          "font-semibold",
        )}
        variant="secondary"
      >
        {label}
      </Badge>
    );
  };

  const handleView = (order: Order) => {
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
    router.push(
      `/home/finance/purchase-orders/create-po?requestId=${request.id}`,
    );
  };

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  };

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
  const columns: Column<Order>[] = [
    { key: "id", header: "Order ID", width: "w-[140px]" },
    { key: "orderTitle", header: "Order Title", width: "min-w-[200px]" },
    { key: "purchaseType", header: "Purchase Type", width: "w-[180px]" },
    {
      key: "requestor",
      header: "Requestor",
      width: "w-[140px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.requested_by}</span>
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
          "order_number",
          "title",
          "service_category",
          "requested_by",
          "department",
          "preferred_vendor",
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
                    {selectedOrder.priority_level}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calculateTotal(selectedOrder.items)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vendor</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.preferred_date}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requestor
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.requested_by}
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
                {selectedOrder.approved_by && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {selectedOrder.status === "approved"
                        ? "Approved By"
                        : "Rejected By"}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedOrder.approved_by}
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
              {selectedOrder.approved_on && (
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {selectedOrder.status === "approved"
                      ? "Approved Date"
                      : "Rejected Date"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedOrder.approved_on).toLocaleDateString(
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
                  There are no approved purchase requests available at this
                  time.
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
