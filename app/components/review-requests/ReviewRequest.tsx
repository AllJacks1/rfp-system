"use client";

import { useState, useMemo } from "react";
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
import { InfoItemProps, Item, Request, ReviewRequestProps } from "@/lib/interfaces";

// Helper to calculate total from items
const calculateTotal = (items: Item[]): string => {
  const total = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
  return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to format currency
const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function ReviewRequest({ requests }: ReviewRequestProps) {
  const [requestList, setRequestList] = useState<Request[]>(requests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(
    null,
  );
  const supabase = createClient();

  const getStatusBadge = (status: Request["status"]) => {
    const styles: Record<string, string> = {
      "for review": "bg-amber-100 text-amber-700",
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

  const handleView = (request: Request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleActionClick = (
    request: Request,
    action: "approved" | "rejected",
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
  if (!selectedRequest || !actionType) return;

  await handleUpdateStatus(selectedRequest.id, actionType);

  setActionDialogOpen(false);
  setSelectedRequest(null);
  setActionType(null);
};

  async function handleUpdateStatus(
    requestId: string,
    status: "approved" | "rejected",
  ) {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", requestId);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Update local UI
      setRequestList((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status } : req)),
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
        value: requests.length,
        icon: FileText,
        color: "text-[#2B3A9F]",
        bgColor: "bg-[#2B3A9F]/10",
      },
      {
        title: "for review",
        value: requests.filter((r) => r.status === "for review").length,
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      {
        title: "Approved",
        value: requests.filter((r) => r.status === "approved").length,
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      {
        title: "Rejected",
        value: requests.filter((r) => r.status === "rejected").length,
        icon: XCircle,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      },
    ],
    [requestList],
  );

  // Define columns with custom widths and renderers
  const columns: Column<Request>[] = [
    {
      key: "request_number",
      header: "Request ID",
      width: "w-[140px]",
    },
    {
      key: "title",
      header: "Request Title",
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
    { value: "for review", label: "For Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

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
          Service and Purchase Requests
        </h1>
        <p className="text-slate-500">
          Manage and track all incoming service and purchase requests in one
          place
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
      <DataTableCard
        data={requestList}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Service and Purchase Requests"
        subtitle="Manage and track all incoming service and purchase requests"
        searchPlaceholder="Search requests..."
        searchable
        searchKeys={[
          "request_number",
          "title",
          "service_category",
          "department",
        ]}
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
            {row.status === "for review" && (
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
        <DialogContent className="sm:max-w-6xl w-[95vw] max-h-[100vh] p-0 gap-0 overflow-hidden">
          {/* Header with subtle background */}
          <DialogHeader className="px-6 py-5 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  Request Details
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {selectedRequest?.request_number}
                </DialogDescription>
              </div>
              {selectedRequest && getStatusBadge(selectedRequest.status)}
            </div>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {selectedRequest && (
              <div className="p-8 space-y-10">
                {/* Request Overview */}
                <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Request Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                    <InfoItem label="Title" value={selectedRequest.title} />
                    <InfoItem
                      label="Service Category"
                      value={selectedRequest.service_category}
                    />
                    <InfoItem
                      label="Priority"
                      value={selectedRequest.priority_level}
                    />
                    <InfoItem label="Requested By" value={selectedRequest.requested_by} />
                    <InfoItem label="Company" value={selectedRequest.company} />
                    <InfoItem
                      label="Department"
                      value={selectedRequest.department}
                    />
                    <InfoItem
                      label="Payment Method"
                      value={selectedRequest.payment_method}
                      className="md:col-span-2"
                    />
                  </div>
                </section>

                {/* Timeline */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Timeline
                    </h3>
                  </div>
                  <div className="bg-[#2B3A9F]/5 rounded-xl p-6 border border-[#2B3A9F]/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <TimelineItem
                        label="Preferred Date"
                        value={selectedRequest.preferred_date}
                      />
                      <TimelineItem
                        label="Required By"
                        value={selectedRequest.required_by}
                      />
                      <TimelineItem
                        label="Expected Completion"
                        value={selectedRequest.expected_completion}
                      />
                    </div>
                  </div>
                </section>

                {/* Vendor */}
                <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Vendor Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <InfoItem
                      label="Preferred Vendor"
                      value={selectedRequest.preferred_vendor}
                    />
                    <InfoItem
                      label="Contact Person"
                      value={selectedRequest.contact_person}
                    />
                  </div>
                </section>

                {/* Vehicle Info */}
                {selectedRequest.vehicle?.plate_number && (
                  <section className="bg-gradient-to-r from-[#2B3A9F]/5 to-white rounded-xl border border-[#2B3A9F]/10 p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Vehicle Information
                      </h3>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs border-[#2B3A9F] text-[#2B3A9F]"
                      >
                        {selectedRequest.vehicle.car_type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <InfoItem
                        label="Plate Number"
                        value={selectedRequest.vehicle.plate_number}
                      />
                      <InfoItem
                        label="Vehicle Type"
                        value={selectedRequest.vehicle.car_type}
                      />
                      <InfoItem
                        label="Owner"
                        value={`${selectedRequest.vehicle.owners_first_name} ${selectedRequest.vehicle.owners_last_name}`}
                      />
                    </div>
                  </section>
                )}

                {/* Description */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Description
                    </h3>
                  </div>
                  <div className="bg-[#2B3A9F]/5 border-l-4 border-[#2B3A9F] rounded-r-lg p-5 text-sm leading-relaxed text-slate-700">
                    {selectedRequest.description}
                  </div>
                </section>

                {/* Items Table */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Requested Items
                      </h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-[#2B3A9F]/10 text-[#2B3A9F] hover:bg-[#2B3A9F]/10"
                    >
                      {selectedRequest.items.length} items
                    </Badge>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-[#2B3A9F]/5">
                        <TableRow className="hover:bg-transparent border-b-2 border-[#2B3A9F]/10">
                          <TableHead className="font-bold text-xs text-[#2B3A9F] py-4">
                            Item
                          </TableHead>
                          <TableHead className="font-bold text-xs text-[#2B3A9F] py-4">
                            Description
                          </TableHead>
                          <TableHead className="font-bold text-xs text-[#2B3A9F] py-4 text-center">
                            Unit
                          </TableHead>
                          <TableHead className="font-bold text-xs text-[#2B3A9F] py-4 text-right">
                            Qty
                          </TableHead>
                          <TableHead className="font-bold text-xs text-[#2B3A9F] py-4 text-right">
                            Unit Price
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRequest.items.map((item, index) => (
                          <TableRow
                            key={index}
                            className="group hover:bg-[#2B3A9F]/5 transition-colors"
                          >
                            <TableCell className="font-semibold text-sm text-slate-900 py-4">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 py-4">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 py-4 text-center">
                              <Badge
                                variant="outline"
                                className="text-xs font-normal border-[#2B3A9F]/30 text-[#2B3A9F]"
                              >
                                {item.unit}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-slate-900 py-4 text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-sm font-medium text-slate-900 py-4 text-right tabular-nums">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Total */}
                  <div className="mt-6 flex justify-end">
                    <div className="bg-[#2B3A9F] text-white rounded-xl px-6 py-4 text-right">
                      <span className="text-xs text-white/70 block mb-1 uppercase tracking-wider">
                        Total Estimated Cost
                      </span>
                      <span className="text-2xl font-bold tabular-nums">
                        {calculateTotal(selectedRequest.items)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Attachments */}
                {selectedRequest.supporting_documents &&
                  selectedRequest.supporting_documents.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 bg-[#2B3A9F] rounded-full" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                          Attachments
                        </h3>
                        <span className="text-xs text-slate-500 ml-auto">
                          {selectedRequest.supporting_documents.length} file(s)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {selectedRequest.supporting_documents.map(
                          (file, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="gap-2 h-auto py-3 px-4 rounded-xl border-slate-200 hover:border-[#2B3A9F] hover:text-[#2B3A9F] hover:bg-[#2B3A9F]/5 transition-colors"
                              onClick={() =>
                                window.open(
                                  file,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <div className="p-2 bg-[#2B3A9F]/10 rounded-lg">
                                <svg
                                  className="w-4 h-4 text-[#2B3A9F]"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                  />
                                </svg>
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-medium block truncate max-w-[200px]">
                                  {file.split("/").pop() || file}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Click to view
                                </span>
                              </div>
                            </Button>
                          ),
                        )}
                      </div>
                    </section>
                  )}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-muted/30 gap-2">
            <div className="flex mb-4 mr-4 gap-4">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Cancel
              </Button>

              {selectedRequest?.status === "for review" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleActionClick(selectedRequest, "rejected");
                    }}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleActionClick(selectedRequest, "approved");
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
              {selectedRequest?.request_number}?
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
