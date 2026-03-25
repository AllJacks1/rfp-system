"use client";

import { useState, useMemo, useRef } from "react";
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
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  Printer,
  DollarSign,
  Package,
  Building2,
  Truck,
  User,
  Calendar,
  CreditCard,
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
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  colors,
  InfoItemProps,
  Item,
  Order,
  Request,
  ReviewOrderProps,
  ReviewRequestProps,
} from "@/lib/interfaces";
import { PrintServiceOrder } from "../service-orders/PrintServiceOrderPage";
import { useReactToPrint } from "react-to-print";

const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
};

// Helper to format currency
const formatCurrency = (value: string | number | undefined | null): string => {
  const amount = Number(value ?? 0);
  console.log(amount)

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export default function ReviewOrder({ orders, units }: ReviewOrderProps) {
  const [ordertList, setOrderList] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(
    null,
  );
  const supabase = createClient();

  const getStatusBadge = (status: Order["status"]) => {
    const styles: Record<string, string> = {
      "for approval": "bg-amber-100 text-amber-700",
      approved: "bg-emerald-100 text-emerald-700",
      rejected: "bg-rose-100 text-rose-700",
    };
    return (
      <Badge
        className={styles[status] || "bg-slate-100 text-slate-700"}
        variant="secondary"
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleActionClick = (order: Order, action: "approved" | "rejected") => {
    setSelectedOrder(order);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder || !actionType) return;

    await handleUpdateStatus(selectedOrder, actionType);

    setActionDialogOpen(false);
    setSelectedOrder(null);
    setActionType(null);
  };

  async function handleUpdateStatus(
    order: Order,
    status: "approved" | "rejected",
  ) {
    try {
      const isServiceOrder = order.order_number.startsWith("SO");

      const table = isServiceOrder ? "service_orders" : "purchase_orders";

      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq("id", order.id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Update UI
      setOrderList((prev) =>
        prev.map((req) => (req.id === order.id ? { ...req, status } : req)),
      );
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  // Stats calculation
  const stats = useMemo(
    () => [
      {
        title: "Total Requests",
        value: orders.length,
        icon: FileText,
        color: "text-[#2B3A9F]",
        bgColor: "bg-[#2B3A9F]/10",
      },
      {
        title: "For Approval",
        value: orders.filter((r) => r.status === "for approval").length,
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      {
        title: "Approved",
        value: orders.filter((r) => r.status === "approved").length,
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      {
        title: "Rejected",
        value: orders.filter((r) => r.status === "rejected").length,
        icon: XCircle,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      },
    ],
    [ordertList],
  );

  // Define columns with custom widths and renderers
  const columns: Column<Order>[] = [
    {
      key: "order_number",
      header: "Order ID",
      width: "w-[140px]",
    },
    {
      key: "title",
      header: "Order Title",
      width: "min-w-[200px]",
    },
    {
      key: "service_category",
      header: "Service Category",
      width: "w-[180px]",
    },
    {
      key: "department",
      header: "Department",
      width: "w-[140px]",
    },
    {
      key: "priority_level",
      header: "Priority",
      width: "w-[100px]",
    },
    {
      key: "status",
      header: "Status",
      width: "w-[110px]",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "preferred_date",
      header: "Preferred Date",
      width: "w-[130px]",
      render: (row) =>
        new Date(row.preferred_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const filterOptions = [
    { value: "for approval", label: "For Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  // Ref for print content
  const contentRef = useRef<HTMLDivElement>(null);

  // Setup react-to-print hook
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: selectedOrder?.order_number
      ? `Service_Order_${selectedOrder.order_number}`
      : "Service_Order_Details",
    pageStyle: `
        @media print {
          @page { size: A4; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-content { padding: 0 !important; }
        }
      `,
  });

  const getPriorityBadge = (priority: string) => {
    const config =
      colors.priority[priority as keyof typeof colors.priority] ||
      colors.priority.Medium;

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
        {priority}
      </Badge>
    );
  };

  const getUnitName = (unitId: string) => {
    const unit = units?.find((u) => u.unit_id === unitId);
    return unit?.name || unitId;
  };

  function mapOrderToRequest(order: Order): Request {
    return {
      id: order.id,
      request_number: order.order_number, // Use order_number as request_number
      title: order.title,
      description: order.description,
      service_category: order.service_category,
      priority_level: order.priority_level,
      company: order.company,
      department: order.department,
      preferred_date: order.preferred_date,
      expected_completion: order.expected_completion,
      supporting_documents: [...order.supporting_documents], // copy array
      vehicle: order.vehicle,
      preferred_vendor: order.preferred_vendor,
      contact_person: order.contact_person,
      required_by: order.required_by,
      payment_method: order.payment_method,
      items: order.items.map((i) => ({ ...i })), // copy items array
      status: order.status,
      requested_by: order.requested_by,
    };
  }

  function InfoItem({ label, value, className }: InfoItemProps) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <dt className="text-xs font-semibold text-[#2B3A9F]/70 uppercase tracking-wider">
          {label}
        </dt>
        <dd className="text-sm font-semibold text-slate-900">
          {value || (
            <span className="text-slate-400 font-normal italic">—</span>
          )}
        </dd>
      </div>
    );
  }

  function TimelineItem({ label, value }: { label: string; value: string }) {
    return (
      <div className="relative pl-4 border-l-2 border-[#2B3A9F]/20">
        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#2B3A9F] ring-4 ring-white" />
        <span className="text-xs font-semibold text-[#2B3A9F]/70 uppercase tracking-wider block mb-1">
          {label}
        </span>
        <span className="text-sm font-bold text-slate-900">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Service and Purchase Orders
        </h1>
        <p className="text-slate-500">
          Manage and track all incoming service and purchase orders in one place
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

      {/* Data Table */}
      <DataTableCard<Order>
        data={ordertList}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Service and Purchase Orders"
        subtitle="Manage and track all incoming service and purchase orders"
        searchPlaceholder="Search requests..."
        searchable
        searchKeys={["order_number", "title", "service_category", "department"]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        actions={(row) => (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row)}
              className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:text-[#2B3A9F]"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View
            </Button>
            {row.status === "for approval" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(row, "approved")}
                  className="h-8 px-3 text-xs font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(row, "rejected")}
                  className="h-8 px-3 text-xs font-medium border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>
              </>
            )}
          </>
        )}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Service Order Details
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                  {selectedOrder?.order_number}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                {selectedOrder && getStatusBadge(selectedOrder.status)}

                {/* Print Button - Only show when order is selected */}
                {selectedOrder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="border-[#E2E8F0] hover:bg-[#EEF2FF] hover:text-[#2B3A9F] hover:border-[#2B3A9F]/30 transition-all"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Hidden Printable Content - Moved outside scrollable area but inside Dialog */}
          {selectedOrder && (
            <div className="hidden">
              <div ref={contentRef}>
                <PrintServiceOrder
                  request={mapOrderToRequest(selectedOrder)}
                  formatCurrency={formatCurrency}
                  serviceOrderNumber={selectedOrder.order_number}
                  units={units}
                />
              </div>
            </div>
          )}

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Title & Description */}
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {selectedOrder.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedOrder.description}
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#2B3A9F]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Company
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedOrder.company}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedOrder.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#2B3A9F]">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Requested By
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedOrder.requested_by}
                      </p>
                      <p className="text-xs text-slate-500">
                        Prepared by: {selectedOrder.order_prepared_by}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#2B3A9F]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Dates
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Preferred:{" "}
                        {new Date(
                          selectedOrder.preferred_date,
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        Expected Completion:{" "}
                        {new Date(
                          selectedOrder.expected_completion,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Service Category
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedOrder.service_category}
                      </p>
                      {getPriorityBadge(selectedOrder.priority_level)}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Payment
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedOrder.payment_method}
                      </p>
                      <p className="text-xs text-slate-500">
                        Required by:{" "}
                        {new Date(
                          selectedOrder.required_by,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.vehicle?.plate_number && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Vehicle
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedOrder.vehicle.plate_number}
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedOrder.vehicle.car_type} •{" "}
                          {selectedOrder.vehicle.owners_first_name}{" "}
                          {selectedOrder.vehicle.owners_last_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#2B3A9F]" />
                  Vendor Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                      Preferred Vendor
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedOrder.preferred_vendor}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                      Contact Person
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedOrder.contact_person}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#2B3A9F]" />
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8FAFC]">
                      <TableRow className="border-b border-[#E2E8F0]">
                        <TableHead className="text-xs font-bold text-slate-600">
                          Item
                        </TableHead>
                        <TableHead className="text-xs font-bold text-slate-600 text-center">
                          Qty
                        </TableHead>
                        <TableHead className="text-xs font-bold text-slate-600 text-right">
                          Unit Price
                        </TableHead>
                        <TableHead className="text-xs font-bold text-slate-600 text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => {
                        const qty = parseFloat(item.quantity) || 0;
                        const price = parseFloat(item.unitPrice) || 0;
                        const total = qty * price;
                        return (
                          <TableRow
                            key={index}
                            className="border-b border-[#E2E8F0] last:border-b-0"
                          >
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {item.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {item.description}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EEF2FF] text-[#2B3A9F]">
                                {item.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-slate-600">
                              {formatCurrency(price)} / {getUnitName(item.unit)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold text-slate-900">
                              {formatCurrency(total)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-3 flex justify-end">
                  <div className="bg-[#EEF2FF] rounded-lg px-4 py-2 border border-[#2B3A9F]/20">
                    <span className="text-sm text-slate-600 mr-2">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-[#2B3A9F] font-mono">
                      {formatCurrency(calculateTotal(selectedOrder.items))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journal Entries */}
              {selectedOrder.journal_entries &&
                selectedOrder.journal_entries.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2B3A9F]" />
                      Journal Entries
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-[#F8FAFC]">
                          <TableRow className="border-b border-[#E2E8F0]">
                            <TableHead className="text-xs font-bold text-slate-600">
                              Account
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-600 text-right text-emerald-600">
                              Debit
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-600 text-right text-rose-600">
                              Credit
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.journal_entries.map((entry, index) => (
                            <TableRow
                              key={index}
                              className="border-b border-[#E2E8F0] last:border-b-0"
                            >
                              <TableCell className="font-medium text-slate-900 capitalize">
                                {(entry.accountTitle || "Unknown").replace(
                                  /-/g,
                                  " ",
                                )}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {entry.entryType === "debit" ? (
                                  <span className="text-emerald-600 font-semibold">
                                    {formatCurrency(entry.amount)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {entry.entryType === "credit" ? (
                                  <span className="text-rose-600 font-semibold">
                                    {formatCurrency(entry.amount)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              {/* Supporting Documents */}
              {selectedOrder.supporting_documents.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Supporting Documents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.supporting_documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EEF2FF] text-[#2B3A9F] text-sm font-medium hover:bg-[#2B3A9F] hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Document {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t bg-muted/30 gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Cancel
              </Button>

              {selectedOrder?.status === "for approval" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleActionClick(selectedOrder, "rejected");
                    }}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleActionClick(selectedOrder, "approved");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approved" ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-600" />
              )}
              {actionType === "approved" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType}{" "}
              {selectedOrder?.order_number}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={
                actionType === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }
            >
              {actionType === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
