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

// Types
interface LineItem {
  id: string;
  referenceDocument: string;
  particulars: string;
  qty: number;
  price: number;
  totalAmount: number;
  chargeTo: string;
}

interface JournalEntry {
  id: number;
  accountTitle: string;
  amount: number;
  entryType: "debit" | "credit";
}

interface RFP {
  id: string;
  orderId: string;
  rfpTitle: string;
  payableTo: string;
  paymentType: "Cheque" | "Cash" | "Bank Transfer" | "Fund Transfer";
  dueDate: string;
  requestDate: string;
  contactNumber: string;
  department: string;
  lineItems: LineItem[];
  requestor: string;
  totalPayable: number;
  journalEntry: JournalEntry[];
  invoiceNumber?: string;
  approvedBy?: string;
  approvedDate?: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  amount: string;
  description: string;
  vendor: string;
}
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

const approvedRFPs: RFP[] = [
  {
    id: "RFP-2024-002",
    orderId: "PO-2024-002",
    rfpTitle: "Office Rent - March 2024",
    payableTo: "Prime Properties LLC",
    paymentType: "Cheque",
    dueDate: "2024-03-15",
    requestDate: "2024-03-09",
    contactNumber: "+63 912 345 6790",
    department: "Administration",
    lineItems: [
      {
        id: "LI-003",
        referenceDocument: "INV-2024-002",
        particulars: "Office Rent - March",
        qty: 1,
        price: 25000,
        totalAmount: 25000,
        chargeTo: "Rent Expense",
      },
    ],
    requestor: "Sarah Johnson",
    totalPayable: 25000,
    journalEntry: [
      {
        id: 4,
        accountTitle: "Rent Expense",
        amount: 25000,
        entryType: "debit",
      },
      {
        id: 5,
        accountTitle: "Accounts Payable",
        amount: 25000,
        entryType: "credit",
      },
    ],
    status: "approved",
    dateSubmitted: "2024-03-09",
    amount: "$25,000",
    description: "Monthly office space rental payment",
    vendor: "Prime Properties LLC",
    invoiceNumber: "INV-2024-002",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-09",
  },
  {
    id: "RFP-2024-004",
    orderId: "PO-2024-004",
    rfpTitle: "Consulting Fees - Q1",
    payableTo: "McKinsey & Company",
    paymentType: "Bank Transfer",
    dueDate: "2024-03-25",
    requestDate: "2024-03-07",
    contactNumber: "+63 912 345 6792",
    department: "Strategy",
    lineItems: [
      {
        id: "LI-006",
        referenceDocument: "INV-2024-004",
        particulars: "Strategy Consulting Services",
        qty: 1,
        price: 45000,
        totalAmount: 45000,
        chargeTo: "Consulting Expense",
      },
    ],
    requestor: "Emily Davis",
    totalPayable: 45000,
    journalEntry: [
      {
        id: 8,
        accountTitle: "Consulting Expense",
        amount: 45000,
        entryType: "debit",
      },
      {
        id: 9,
        accountTitle: "Accounts Payable",
        amount: 45000,
        entryType: "credit",
      },
    ],
    status: "rejected",
    dateSubmitted: "2024-03-07",
    amount: "$45,000",
    description: "Strategy consulting fees for market expansion project",
    vendor: "McKinsey & Company",
    invoiceNumber: "INV-2024-004",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-07",
  },
  {
    id: "RFP-2024-005",
    orderId: "PO-2024-005",
    rfpTitle: "IT Equipment Maintenance",
    payableTo: "TechSupport Inc.",
    paymentType: "Cheque",
    dueDate: "2024-03-18",
    requestDate: "2024-03-06",
    contactNumber: "+63 912 345 6793",
    department: "Engineering",
    lineItems: [
      {
        id: "LI-007",
        referenceDocument: "INV-2024-005",
        particulars: "Server Maintenance",
        qty: 1,
        price: 2000,
        totalAmount: 2000,
        chargeTo: "IT Maintenance Expense",
      },
      {
        id: "LI-008",
        referenceDocument: "INV-2024-005",
        particulars: "Network Equipment Check",
        qty: 1,
        price: 1500,
        totalAmount: 1500,
        chargeTo: "IT Maintenance Expense",
      },
    ],
    requestor: "Robert Wilson",
    totalPayable: 3500,
    journalEntry: [
      {
        id: 10,
        accountTitle: "IT Maintenance Expense",
        amount: 3500,
        entryType: "debit",
      },
      {
        id: 11,
        accountTitle: "Accounts Payable",
        amount: 3500,
        entryType: "credit",
      },
    ],
    status: "approved",
    dateSubmitted: "2024-03-06",
    amount: "$3,500",
    description: "Quarterly server and network equipment maintenance",
    vendor: "TechSupport Inc.",
    invoiceNumber: "INV-2024-005",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-06",
  },
  {
    id: "RFP-2024-006",
    orderId: "PO-2024-006",
    rfpTitle: "Employee Training Program",
    payableTo: "FranklinCovey",
    paymentType: "Bank Transfer",
    dueDate: "2024-03-22",
    requestDate: "2024-03-05",
    contactNumber: "+63 912 345 6794",
    department: "HR",
    lineItems: [
      {
        id: "LI-009",
        referenceDocument: "INV-2024-006",
        particulars: "Leadership Development Workshop",
        qty: 10,
        price: 800,
        totalAmount: 8000,
        chargeTo: "Training Expense",
      },
    ],
    requestor: "Lisa Anderson",
    totalPayable: 8000,
    journalEntry: [
      {
        id: 12,
        accountTitle: "Training Expense",
        amount: 8000,
        entryType: "debit",
      },
      {
        id: 13,
        accountTitle: "Accounts Payable",
        amount: 8000,
        entryType: "credit",
      },
    ],
    status: "approved",
    dateSubmitted: "2024-03-05",
    amount: "$8,000",
    description: "Payment for leadership development workshop",
    vendor: "FranklinCovey",
    invoiceNumber: "INV-2024-006",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-04",
  },
  {
    id: "RFP-2024-007",
    orderId: "PO-2024-007",
    rfpTitle: "Travel Expenses - Sales Team",
    payableTo: "Various Airlines/Hotels",
    paymentType: "Cash",
    dueDate: "2024-03-12",
    requestDate: "2024-03-04",
    contactNumber: "+63 912 345 6795",
    department: "Sales",
    lineItems: [
      {
        id: "LI-010",
        referenceDocument: "INV-2024-007",
        particulars: "Airfare - Client Visit",
        qty: 2,
        price: 1500,
        totalAmount: 3000,
        chargeTo: "Travel Expense",
      },
      {
        id: "LI-011",
        referenceDocument: "INV-2024-007",
        particulars: "Hotel Accommodation",
        qty: 2,
        price: 1100,
        totalAmount: 2200,
        chargeTo: "Travel Expense",
      },
    ],
    requestor: "David Brown",
    totalPayable: 5200,
    journalEntry: [
      {
        id: 14,
        accountTitle: "Travel Expense",
        amount: 5200,
        entryType: "debit",
      },
      {
        id: 15,
        accountTitle: "Cash on Hand",
        amount: 5200,
        entryType: "credit",
      },
    ],
    status: "approved",
    dateSubmitted: "2024-03-04",
    amount: "$5,200",
    description: "Client visit travel expenses for March",
    vendor: "Various Airlines/Hotels",
    invoiceNumber: "INV-2024-007",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-04",
  },
];

export default function Liquidation() {
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

  const handleCreateLiquidation = (rfp: RFP) => {
    console.log("Creating RFP from PO:", rfp.id);
    setApprovedRFPDialogOpen(false);
    router.push(`/home/finance/liquidation/liquidate?rfpId=${rfp.id}`);
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
        <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header - Clean slate with subtle border */}
          <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900 tracking-tight">
                  Approved RPF Requests
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select an approved RPF request to liquidate
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {approvedRFPs.length} requests
              </Badge>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            {approvedRFPs.length === 0 ? (
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
                        RFP ID
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 text-start w-40">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedRFPs.map((rfp) => (
                      <TableRow
                        key={rfp.id}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-sm text-slate-700 py-4">
                          {rfp.id}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900 py-4">
                          {rfp.rfpTitle}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            size="sm"
                            onClick={() => handleCreateLiquidation(rfp)}
                            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white gap-2"
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
            <div className="mb-4 mr-4">
              <Button
                variant="outline"
                onClick={() => setApprovedRFPDialogOpen(false)}
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
