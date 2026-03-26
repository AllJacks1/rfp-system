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
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  ArrowRight,
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
import { useRouter } from "next/navigation";
import {
  LiquidationPageProps,
  RequestForPaymentInterface,
} from "@/lib/interfaces";

interface Liquidation {
  id: string;
  liquidationTitle: string;
  liquidationType: string;
  status: "for_liquidation" | "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  department: string;
  originalAmount: string;
  liquidatedAmount: string;
  description: string;
  rfpReference: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Mock Data for Liquidation
const mockLiquidations: Liquidation[] = [
  {
    id: "LIQ-2024-001",
    liquidationTitle: "Q1 Travel Expenses Liquidation",
    liquidationType: "Travel",
    status: "for_liquidation",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    department: "Sales",
    originalAmount: "$5,000",
    liquidatedAmount: "$4,750",
    description: "Liquidation for client visit travel expenses - under budget",
    rfpReference: "RFP-2024-007",
  },
  {
    id: "LIQ-2024-002",
    liquidationTitle: "Marketing Campaign Liquidation",
    liquidationType: "Marketing",
    status: "submitted",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Marketing",
    originalAmount: "$15,000",
    liquidatedAmount: "$14,200",
    description: "Digital campaign liquidation - unused funds returned",
    rfpReference: "RFP-2024-003",
  },
  {
    id: "LIQ-2024-003",
    liquidationTitle: "Office Supplies Liquidation",
    liquidationType: "Office Supplies",
    status: "approved",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    department: "Administration",
    originalAmount: "$1,000",
    liquidatedAmount: "$850",
    description: "Quarterly supplies liquidation - bulk discount applied",
    rfpReference: "RFP-2024-002",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-08",
  },
  {
    id: "LIQ-2024-004",
    liquidationTitle: "IT Equipment Liquidation",
    liquidationType: "IT Equipment",
    status: "for_liquidation",
    dateSubmitted: "2024-03-07",
    requestor: "Emily Davis",
    department: "Engineering",
    originalAmount: "$12,500",
    liquidatedAmount: "$12,500",
    description: "Full liquidation - all equipment received as ordered",
    rfpReference: "RFP-2024-001",
  },
  {
    id: "LIQ-2024-005",
    liquidationTitle: "Training Program Liquidation",
    liquidationType: "Training",
    status: "rejected",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    department: "HR",
    originalAmount: "$8,000",
    liquidatedAmount: "$9,200",
    description: "Over budget - additional participants attended",
    rfpReference: "RFP-2024-006",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-06",
  },
  {
    id: "LIQ-2024-006",
    liquidationTitle: "Consulting Fees Liquidation",
    liquidationType: "Consulting",
    status: "approved",
    dateSubmitted: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "Strategy",
    originalAmount: "$20,000",
    liquidatedAmount: "$18,500",
    description: "Project completed under budget - early delivery bonus",
    rfpReference: "RFP-2024-004",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-05",
  },
  {
    id: "LIQ-2024-007",
    liquidationTitle: "Event Management Liquidation",
    liquidationType: "Events",
    status: "submitted",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    department: "Marketing",
    originalAmount: "$25,000",
    liquidatedAmount: "$23,800",
    description: "Annual retreat liquidation - vendor discount applied",
    rfpReference: "RFP-2024-008",
  },
  {
    id: "LIQ-2024-008",
    liquidationTitle: "Legal Services Liquidation",
    liquidationType: "Legal",
    status: "for_liquidation",
    dateSubmitted: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Legal",
    originalAmount: "$18,000",
    liquidatedAmount: "$16,500",
    description: "Contract review completed - fewer hours than estimated",
    rfpReference: "RFP-2024-008",
  },
];

export default function Liquidation({ rfps }: LiquidationPageProps) {
  const [liquidations, setLiquidations] =
    useState<Liquidation[]>(mockLiquidations);
  const [selectedLiquidation, setSelectedLiquidation] =
    useState<Liquidation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvedRFPDialogOpen, setApprovedRFPDialogOpen] = useState(false);
  const router = useRouter();

  const getStatusBadge = (status: Liquidation["status"]) => {
    const styles = {
      for_liquidation: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
      submitted: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      rejected: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    };
    const labels = {
      for_liquidation: "For Liquidation",
      submitted: "Submitted",
      approved: "Approved",
      rejected: "Rejected",
    };
    return (
      <Badge className={styles[status]} variant="secondary">
        {labels[status]}
      </Badge>
    );
  };

  const handleView = (liquidation: Liquidation) => {
    setSelectedLiquidation(liquidation);
    setViewDialogOpen(true);
  };

  const handleReviewRFP = () => {
    setApprovedRFPDialogOpen(true);
  };

  // Stats calculation - 5 stats for Liquidation
  const stats = [
    {
      title: "Total Requests",
      value: liquidations.length,
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "For Liquidation",
      value: liquidations.filter((l) => l.status === "for_liquidation").length,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Submitted",
      value: liquidations.filter((l) => l.status === "submitted").length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: liquidations.filter((l) => l.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: liquidations.filter((l) => l.status === "rejected").length,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Define columns for Liquidation
  const columns: Column<Liquidation>[] = [
    { key: "id", header: "Liquidation ID", width: "w-[150px]" },
    {
      key: "liquidationTitle",
      header: "Liquidation Title",
      width: "min-w-[200px]",
    },
    { key: "liquidationType", header: "Type", width: "w-[140px]" },
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
      key: "originalAmount",
      header: "Original",
      width: "w-[100px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-slate-400 line-through text-xs">
            {row.originalAmount}
          </span>
          <span className="font-medium text-emerald-600">
            {row.liquidatedAmount}
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
      key: "dateSubmitted",
      header: "Date Submitted",
      width: "w-[130px]",
      render: (row) =>
        new Date(row.dateSubmitted).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const filterOptions = [
    { value: "for_liquidation", label: "For Liquidation" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const handleCreateLiquidation = (rfp: RequestForPaymentInterface) => {
    console.log("Creating RFP from PO:", rfp.id);
    setApprovedRFPDialogOpen(false);
    router.push(`/home/finance/liquidation/liquidate/${rfp.id}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Liquidation</h1>
        <p className="text-slate-500">
          Manage and track all your liquidated requests in one place
        </p>
      </div>

      {/* Stats Grid - 5 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
        data={liquidations}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Liquidated Requests"
        subtitle="View and manage your liquidation requests"
        searchPlaceholder="Search liquidations..."
        searchable
        searchKeys={[
          "id",
          "liquidationTitle",
          "liquidationType",
          "requestor",
          "department",
          "rfpReference",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20"
            onClick={handleReviewRFP}
          >
            <Plus className="mr-2 h-4 w-4" />
            Review RFP requests
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
              Liquidation Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Full details for {selectedLiquidation?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedLiquidation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Liquidation ID
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedLiquidation.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Liquidation Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.liquidationType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    RFP Reference
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.rfpReference}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Original Amount
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.originalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Liquidated Amount
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      parseFloat(
                        selectedLiquidation.liquidatedAmount.replace(
                          /[^0-9.-]+/g,
                          "",
                        ),
                      ) <=
                      parseFloat(
                        selectedLiquidation.originalAmount.replace(
                          /[^0-9.-]+/g,
                          "",
                        ),
                      )
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {selectedLiquidation.liquidatedAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requestor
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.requestor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedLiquidation.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date Submitted
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(
                      selectedLiquidation.dateSubmitted,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {selectedLiquidation.approvedBy && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {selectedLiquidation.status === "approved"
                        ? "Approved By"
                        : "Rejected By"}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedLiquidation.approvedBy}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {selectedLiquidation.description}
                </p>
              </div>
              {selectedLiquidation.approvedDate && (
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {selectedLiquidation.status === "approved"
                      ? "Approved Date"
                      : "Rejected Date"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(
                      selectedLiquidation.approvedDate,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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

      <Dialog
        open={approvedRFPDialogOpen}
        onOpenChange={setApprovedRFPDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header - Clean slate with subtle border */}
          <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900 tracking-tight">
                  Approved RFP Requests
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select an approved RFP request to liquidate
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              >
                {rfps.length} approved
              </Badge>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            {rfps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No approved requests
                </h3>
                <p className="text-sm text-slate-500">
                  There are no approved RFP requests available at this time.
                </p>
              </div>
            ) : (
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-40">
                        RFP Number
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-48">
                        Payable To
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-32">
                        Payment Method
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-32 text-right">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-28 text-center">
                        Items
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-36 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfps.map((rfp) => (
                      <TableRow
                        key={rfp.id}
                        className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        {/* RFP Number */}
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-semibold text-[#2B3A9F]">
                              {rfp.rfp_number}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              PO: {rfp.order_number}
                            </span>
                          </div>
                        </TableCell>

                        {/* Payable To */}
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900 line-clamp-1">
                              {rfp.payable_to}
                            </span>
                            <span className="text-xs text-slate-500">
                              {rfp.department}
                            </span>
                          </div>
                        </TableCell>

                        {/* Payment Method */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {rfp.payment_method}
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="py-4 text-right">
                          <span className="font-mono text-sm font-semibold text-slate-900">
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(Number(rfp.total_payable) || 0)}
                          </span>
                        </TableCell>

                        {/* Item Count */}
                        <TableCell className="py-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {rfp.line_items?.length || 0} items
                          </span>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="py-4 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleCreateLiquidation(rfp)}
                            className="bg-[#2B3A9F] hover:bg-[#1E2A7A] text-white gap-2 shadow-sm transition-all"
                          >
                            Liquidate
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
            <Button
              variant="outline"
              onClick={() => setApprovedRFPDialogOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
