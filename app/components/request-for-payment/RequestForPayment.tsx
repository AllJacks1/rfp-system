"use client";

import { useRef, useState } from "react";
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
  Calendar,
  User,
  Building2,
  Hash,
  CreditCard,
  Printer,
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
import { useReactToPrint } from "react-to-print";
import { PrintRequestForPayment } from "@/app/components/request-for-payment/PrintRequestForPayment";

// ✅ Updated interfaces to match your actual data structure
interface LineItem {
  id?: string;
  qty: number;
  price: number;
  charge_to: string;
  particulars: string;
  total_amount: number;
  invoice_number: string;
}

export interface RequestForPaymentInterface {
  id: string;
  created_at: string;
  order_id: string;
  order_number: string;
  payable_to: string;
  payment_method: "Cash" | "Check" | "Bank Transfer" | "Credit Card" | string;
  due_date: string;
  request_date: string;
  contact_number: string;
  department: string;
  line_items: LineItem[];
  requested_by: string;
  total_payable: string | number;
  approved_by: string | null;
  approved_date: string | null;
  status: "for approval" | "approved" | "rejected" | string;
  rfp_number: string;
  // Optional fields for compatibility
  rfpTitle?: string;
  description?: string;
  vendor?: string;
  invoiceNumber?: string;
  journalEntry?: Array<{
    id: string;
    accountTitle: string;
    entryType: "debit" | "credit";
    amount: number;
  }>;
}

interface RequestForPaymentProps {
  rfps: RequestForPaymentInterface[];
  orders?: Array<{
    id: string;
    order_number: string;
    description: string;
    service_category: string;
    items: Array<{
      quantity: string | number;
      unitPrice: string | number;
    }>;
  }>;
}

export default function RequestForPayment({ rfps, orders = [] }: RequestForPaymentProps) {
  const [selectedRfp, setSelectedRfp] = useState<RequestForPaymentInterface | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvedPODialogOpen, setApprovedPODialogOpen] = useState(false);
  const router = useRouter();

  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: selectedRfp ? `RFP_${selectedRfp.rfp_number}` : "RFP_Details",
    pageStyle: `
      @media print {
        @page { size: A4; margin: 15mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-only { display: block !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  // ✅ Updated status config to handle "for approval" status
  const getStatusBadge = (status: string) => {
    const config: Record<string, {
      bg: string;
      text: string;
      border: string;
      icon: React.ElementType;
      label: string;
    }> = {
      "for approval": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "For Approval",
      },
      submitted: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "Pending Review",
      },
      approved: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const style = config[status] || config["for approval"];
    const Icon = style.icon;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${style.bg} ${style.text} ${style.border}`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {style.label}
        </span>
      </div>
    );
  };

  // ✅ Safe number parsing for total_payable (string | number)
  const parseAmount = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return isNaN(value) ? 0 : value;
    const parsed = parseFloat(value.toString().replace(/[₱$,\s]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (value: string | number | null | undefined): string => {
    const num = parseAmount(value);
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(num);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleView = (rfp: RequestForPaymentInterface) => {
    setSelectedRfp(rfp);
    setViewDialogOpen(true);
  };

  const handleReviewOrders = () => {
    setApprovedPODialogOpen(true);
  };

  const handleCreateRFP = (order: NonNullable<RequestForPaymentProps["orders"]>[number]) => {
    setApprovedPODialogOpen(false);
    router.push(`/home/finance/request-for-payment/create-rfp/${order.id}`);
  };

  // ✅ Stats using actual data fields
  const stats = [
    {
      title: "Total Requests",
      value: rfps.length,
      icon: FileText,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
    },
    {
      title: "Pending Review",
      value: rfps.filter((r) => r.status === "for approval" || r.status === "submitted").length,
      icon: Clock,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Approved",
      value: rfps.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Rejected",
      value: rfps.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
  ];

  // ✅ Updated columns to use actual data fields
  const columns: Column<RequestForPaymentInterface>[] = [
    {
      key: "rfp_number",
      header: "RFP Reference",
      width: "w-[160px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-slate-900">
            {row.rfp_number}
          </span>
          <span className="text-[10px] text-slate-500">PO: {row.order_number}</span>
        </div>
      ),
    },
    {
      key: "payable_to",
      header: "Payable To",
      width: "min-w-[200px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">
            {row.payable_to}
          </span>
          <span className="text-xs text-slate-500 truncate max-w-[200px]">
            {row.department}
          </span>
        </div>
      ),
    },
    {
      key: "payment_method",
      header: "Payment Method",
      width: "w-[130px]",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{row.payment_method}</span>
        </div>
      ),
    },
    {
      key: "requested_by",
      header: "Requestor",
      width: "w-[160px]",
      render: (row) => (
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {row.requested_by
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-slate-900">
              {row.requested_by}
            </span>
            <span className="text-xs text-slate-500">{row.department}</span>
          </div>
        </div>
      ),
    },
    {
      key: "total_payable",
      header: "Amount",
      width: "w-[130px]",
      render: (row) => (
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-slate-900">
            {formatCurrency(row.total_payable)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-[130px]",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "created_at",
      header: "Date Created",
      width: "w-[120px]",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm">{formatDate(row.created_at)}</span>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { value: "for approval", label: "For Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Requests for Payment
          </h1>
          <p className="text-sm text-slate-500">
            Manage payment authorizations and track RFP status
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <DataTableCard
        data={rfps}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="Payment Requests"
        subtitle={`${rfps.length} total requests in the system`}
        searchPlaceholder="Search by RFP number, payable to, requestor, or department..."
        searchable
        searchKeys={[
          "rfp_number",
          "order_number",
          "payable_to",
          "requested_by",
          "department",
          "payment_method",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            onClick={handleReviewOrders}
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create RFP from Approved POs
          </Button>
        }
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row)}
            className="h-8 px-3 text-xs"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View Details
          </Button>
        )}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          {/* Screen Header */}
          <DialogHeader className="px-6 py-5 border-b bg-slate-50 no-print">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DialogTitle className="text-lg font-semibold text-slate-900">
                    RFP Details
                  </DialogTitle>
                  {selectedRfp && getStatusBadge(selectedRfp.status)}
                </div>
                <DialogDescription className="text-sm text-slate-500">
                  Reference:{" "}
                  <span className="font-mono font-medium text-slate-700">
                    {selectedRfp?.rfp_number}
                  </span>
                </DialogDescription>
              </div>
              {selectedRfp && (
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold font-mono text-slate-900">
                    {formatCurrency(selectedRfp.total_payable)}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Print Content */}
          <div ref={printContentRef} className="print-only">
            {selectedRfp && <PrintRequestForPayment rfp={selectedRfp} />}
          </div>

          {/* Screen Content */}
          {selectedRfp && (
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] no-print">
              <div className="p-6 space-y-6">
                {/* Payee & Payment Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Payee Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Payable To
                        </label>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedRfp.payable_to}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Contact Number
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedRfp.contact_number}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Department
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedRfp.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5" />
                      Payment Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Method
                        </label>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedRfp.payment_method}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Due Date
                        </label>
                        <p className="text-sm text-slate-700 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {formatDate(selectedRfp.due_date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Order Reference
                        </label>
                        <p className="text-sm font-mono text-slate-700">
                          {selectedRfp.order_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requestor Info */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Request Information
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                        Requested By
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedRfp.requested_by}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                        Request Date
                      </label>
                      <p className="text-sm text-slate-700">
                        {formatDate(selectedRfp.request_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                        Created At
                      </label>
                      <p className="text-sm text-slate-700">
                        {formatDate(selectedRfp.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {selectedRfp.line_items?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Itemized Expenses
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase w-32">
                              Invoice #
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase">
                              Particulars
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-center w-16">
                              Qty
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-28">
                              Unit Price
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-28">
                              Amount
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase w-28">
                              Charge To
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRfp.line_items.map((item, idx) => (
                            <TableRow key={item.id || idx} className="text-[11px]">
                              <TableCell className="font-mono text-slate-600">
                                {item.invoice_number}
                              </TableCell>
                              <TableCell className="text-slate-900">
                                {item.particulars}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.qty}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(item.price)}
                              </TableCell>
                              <TableCell className="text-right font-mono font-medium text-slate-900">
                                {formatCurrency(item.total_amount)}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {item.charge_to || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-3">
                      <div className="bg-[#2B3A9F] text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">
                            Total Payable
                          </span>
                          <span className="text-lg font-bold font-mono">
                            {formatCurrency(selectedRfp.total_payable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Info */}
                {selectedRfp.approved_by && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      {selectedRfp.status === "approved" ? "Approval" : "Rejection"} Details
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRfp.approved_by}
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedRfp.status === "approved" ? "Approved on" : "Rejected on"}{" "}
                          {formatDate(selectedRfp.approved_date)}
                        </p>
                      </div>
                      {selectedRfp.status === "approved" ? (
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      ) : (
                        <XCircle className="h-8 w-8 text-rose-600" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-slate-50 no-print">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
                className="border-slate-300"
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePrint()}
                className="border-slate-300"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print / PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approved POs Dialog */}
      {orders.length > 0 && (
        <Dialog
          open={approvedPODialogOpen}
          onOpenChange={setApprovedPODialogOpen}
        >
          <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Approved Purchase Orders
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 mt-1">
                    Select an approved PO to generate a new payment request
                  </DialogDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 text-[#2B3A9F] border border-[#2B3A9F]/20 font-semibold"
                >
                  {orders.length} available
                </Badge>
              </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                      <TableHead className="font-bold text-xs text-slate-600 py-4 w-40">
                        PO Reference
                      </TableHead>
                      <TableHead className="font-bold text-xs text-slate-600 py-4">
                        Description
                      </TableHead>
                      <TableHead className="font-bold text-xs text-slate-600 py-4 w-40">
                        Type
                      </TableHead>
                      <TableHead className="font-bold text-xs text-slate-600 py-4 text-right w-40">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="group hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0"
                      >
                        <TableCell className="font-mono text-sm text-[#2B3A9F] font-semibold py-4">
                          {order.order_number}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-slate-900 py-4">
                          <span className="truncate max-w-[250px] block">
                            {order.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 py-4">
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-200 text-slate-600 bg-white"
                          >
                            {order.service_category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            size="sm"
                            onClick={() => handleCreateRFP(order)}
                            className="bg-[#2B3A9F] hover:bg-[#1E2A7A] text-white gap-2 shadow-md shadow-[#2B3A9F]/20 transition-all hover:shadow-lg"
                          >
                            Create RFP
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <Button
                variant="outline"
                onClick={() => setApprovedPODialogOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}