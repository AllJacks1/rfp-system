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

interface Order {
  id: string;
  poTitle: string;
  poType: string;
  status: "approved";
  dateApproved: string;
  requestor: string;
  department: string;
  vendor: string;
  totalAmount: string;
  description: string;
}

const mockPurchaseOrders: Order[] = [
  {
    id: "PO-2024-001",
    poTitle: "Q1 Software License Payment",
    poType: "Software License",
    status: "approved",
    dateApproved: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    vendor: "Microsoft / AWS",
    totalAmount: "$12,500",
    description: "Payment for annual Microsoft 365 and AWS subscriptions",
  },
  {
    id: "PO-2024-002",
    poTitle: "Office Rent - March 2024",
    poType: "Rent",
    status: "approved",
    dateApproved: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    vendor: "Prime Properties LLC",
    totalAmount: "$25,000",
    description: "Monthly office space rental payment",
  },
  {
    id: "PO-2024-003",
    poTitle: "Marketing Campaign Payment",
    poType: "Marketing Services",
    status: "approved",
    dateApproved: "2024-03-08",
    requestor: "Mike Chen",
    department: "Marketing",
    vendor: "Digital Marketing Pro",
    totalAmount: "$15,000",
    description: "Payment for Q1 digital marketing campaign execution",
  },
];

const mockRFPs: RFP[] = [
  {
    id: "RFP-2024-001",
    orderId: "PO-2024-001",
    rfpTitle: "Q1 Software License Payment",
    payableTo: "Microsoft / AWS",
    paymentType: "Bank Transfer",
    dueDate: "2024-03-15",
    requestDate: "2024-03-10",
    contactNumber: "+63 912 345 6789",
    department: "Engineering",
    lineItems: [
      {
        id: "LI-001",
        referenceDocument: "INV-2024-001-A",
        particulars:
          "Microsoft 365 Enterprise E5 Annual Subscription - 500 users",
        qty: 500,
        price: 420,
        totalAmount: 210000,
        chargeTo: "5100-01 Software Licenses",
      },
      {
        id: "LI-002",
        referenceDocument: "INV-2024-001-B",
        particulars: "AWS EC2 Reserved Instances - 3 Year Term",
        qty: 1,
        price: 125000,
        totalAmount: 125000,
        chargeTo: "5200-02 Cloud Infrastructure",
      },
      {
        id: "LI-003",
        referenceDocument: "INV-2024-001-B",
        particulars: "AWS RDS Database Storage - Annual Commitment",
        qty: 1,
        price: 45000,
        totalAmount: 45000,
        chargeTo: "5200-02 Cloud Infrastructure",
      },
      {
        id: "LI-004",
        referenceDocument: "INV-2024-001-B",
        particulars: "AWS S3 Data Transfer & Storage - 50TB Tier",
        qty: 1,
        price: 28000,
        totalAmount: 28000,
        chargeTo: "5200-02 Cloud Infrastructure",
      },
      {
        id: "LI-005",
        referenceDocument: "INV-2024-001-C",
        particulars: "Oracle Database Enterprise Edition License - Perpetual",
        qty: 4,
        price: 87500,
        totalAmount: 350000,
        chargeTo: "5100-03 Database Licenses",
      },
      {
        id: "LI-006",
        referenceDocument: "INV-2024-001-C",
        particulars: "Oracle Annual Technical Support - 22% of License",
        qty: 4,
        price: 19250,
        totalAmount: 77000,
        chargeTo: "6100-01 Maintenance & Support",
      },
      {
        id: "LI-007",
        referenceDocument: "INV-2024-001-D",
        particulars: "Salesforce Sales Cloud Enterprise - 200 licenses",
        qty: 200,
        price: 1800,
        totalAmount: 360000,
        chargeTo: "5300-01 CRM Subscriptions",
      },
      {
        id: "LI-008",
        referenceDocument: "INV-2024-001-D",
        particulars: "Salesforce Service Cloud Add-on - 50 licenses",
        qty: 50,
        price: 1200,
        totalAmount: 60000,
        chargeTo: "5300-01 CRM Subscriptions",
      },
      {
        id: "LI-009",
        referenceDocument: "INV-2024-001-E",
        particulars: "Adobe Creative Cloud Enterprise - 75 licenses",
        qty: 75,
        price: 840,
        totalAmount: 63000,
        chargeTo: "5100-02 Creative Software",
      },
      {
        id: "LI-010",
        referenceDocument: "INV-2024-001-E",
        particulars: "Adobe Acrobat Pro DC - 200 licenses",
        qty: 200,
        price: 240,
        totalAmount: 48000,
        chargeTo: "5100-02 Creative Software",
      },
      {
        id: "LI-011",
        referenceDocument: "INV-2024-001-F",
        particulars: "SAP S/4HANA Cloud Subscription - Professional Edition",
        qty: 1,
        price: 185000,
        totalAmount: 185000,
        chargeTo: "5400-01 ERP Subscriptions",
      },
      {
        id: "LI-012",
        referenceDocument: "INV-2024-001-F",
        particulars: "SAP Implementation Services - Phase 1",
        qty: 1,
        price: 95000,
        totalAmount: 95000,
        chargeTo: "7100-02 Professional Services",
      },
      {
        id: "LI-013",
        referenceDocument: "INV-2024-001-G",
        particulars: "GitHub Enterprise Cloud - 150 developers",
        qty: 150,
        price: 252,
        totalAmount: 37800,
        chargeTo: "5100-04 Development Tools",
      },
      {
        id: "LI-014",
        referenceDocument: "INV-2024-001-H",
        particulars: "Atlassian Jira & Confluence Data Center - 500 users",
        qty: 500,
        price: 96,
        totalAmount: 48000,
        chargeTo: "5100-05 Collaboration Tools",
      },
      {
        id: "LI-015",
        referenceDocument: "INV-2024-001-I",
        particulars: "Datadog Cloud Monitoring - Enterprise Plan Annual",
        qty: 1,
        price: 42000,
        totalAmount: 42000,
        chargeTo: "6200-01 Monitoring & Observability",
      },
      {
        id: "LI-016",
        referenceDocument: "INV-2024-001-J",
        particulars: "Okta Identity Cloud - Universal Directory Tier",
        qty: 1,
        price: 36000,
        totalAmount: 36000,
        chargeTo: "5500-01 Identity & Security",
      },
      {
        id: "LI-017",
        referenceDocument: "INV-2024-001-K",
        particulars: "Cloudflare Enterprise CDN & Security - Annual",
        qty: 1,
        price: 28000,
        totalAmount: 28000,
        chargeTo: "5500-02 Network Security",
      },
      {
        id: "LI-018",
        referenceDocument: "INV-2024-001-L",
        particulars: "Twilio Communication APIs - Prepaid Credits",
        qty: 1,
        price: 15000,
        totalAmount: 15000,
        chargeTo: "6300-01 Communication Services",
      },
    ],
    requestor: "John Smith",
    totalPayable: 12500,
    journalEntry: [
      {
        id: 1,
        accountTitle: "Software Licenses Expense",
        amount: 321000,
        entryType: "debit",
      },
      {
        id: 2,
        accountTitle: "Cloud Infrastructure Expense",
        amount: 198000,
        entryType: "debit",
      },
      {
        id: 3,
        accountTitle: "Database License Assets",
        amount: 350000,
        entryType: "debit",
      },
      {
        id: 4,
        accountTitle: "Maintenance & Support Expense",
        amount: 77000,
        entryType: "debit",
      },
      {
        id: 5,
        accountTitle: "CRM Subscription Expense",
        amount: 420000,
        entryType: "debit",
      },
      {
        id: 6,
        accountTitle: "ERP Subscription Expense",
        amount: 280000,
        entryType: "debit",
      },
      {
        id: 7,
        accountTitle: "Professional Services Expense",
        amount: 95000,
        entryType: "debit",
      },
      {
        id: 8,
        accountTitle: "Security & Identity Expense",
        amount: 64000,
        entryType: "debit",
      },
      {
        id: 9,
        accountTitle: "Network & Communication Expense",
        amount: 43000,
        entryType: "debit",
      },
      {
        id: 10,
        accountTitle: "Accounts Payable - Trade",
        amount: 1843800,
        entryType: "credit",
      },
    ],
    status: "submitted",
    dateSubmitted: "2024-03-10",
    amount: "$12,500",
    description: "Payment for annual Microsoft 365 and AWS subscriptions",
    vendor: "Microsoft / AWS",
    invoiceNumber: "INV-2024-001",
  },
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
    id: "RFP-2024-003",
    orderId: "PO-2024-003",
    rfpTitle: "Marketing Campaign Payment",
    payableTo: "Digital Marketing Pro",
    paymentType: "Bank Transfer",
    dueDate: "2024-03-20",
    requestDate: "2024-03-08",
    contactNumber: "+63 912 345 6791",
    department: "Marketing",
    lineItems: [
      {
        id: "LI-004",
        referenceDocument: "INV-2024-003",
        particulars: "Digital Ads Management",
        qty: 1,
        price: 9000,
        totalAmount: 9000,
        chargeTo: "Marketing Expense",
      },
      {
        id: "LI-005",
        referenceDocument: "INV-2024-003",
        particulars: "Social Media Campaign",
        qty: 1,
        price: 6000,
        totalAmount: 6000,
        chargeTo: "Marketing Expense",
      },
    ],
    requestor: "Mike Chen",
    totalPayable: 15000,
    journalEntry: [
      {
        id: 6,
        accountTitle: "Marketing Expense",
        amount: 15000,
        entryType: "debit",
      },
      {
        id: 7,
        accountTitle: "Accounts Payable",
        amount: 15000,
        entryType: "credit",
      },
    ],
    status: "submitted",
    dateSubmitted: "2024-03-08",
    amount: "$15,000",
    description: "Payment for Q1 digital marketing campaign execution",
    vendor: "Digital Marketing Pro",
    invoiceNumber: "INV-2024-003",
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
    status: "submitted",
    dateSubmitted: "2024-03-05",
    amount: "$8,000",
    description: "Payment for leadership development workshop",
    vendor: "FranklinCovey",
    invoiceNumber: "INV-2024-006",
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

export default function RequestForPayment() {
  const [rfps, setRfps] = useState<RFP[]>(mockRFPs);
  const [selectedRfp, setSelectedRfp] = useState<RFP | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvedPODialogOpen, setApprovedPODialogOpen] = useState(false);
  const router = useRouter();

  // ✅ CORRECT v3.x setup: Create ref and use it with contentRef
  const printContentRef = useRef<HTMLDivElement>(null);

  // ✅ CORRECT v3.x: useReactToPrint returns a function, takes options with contentRef
  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: selectedRfp ? `RFP_${selectedRfp.id}` : "RFP_Details",
    pageStyle: `
      @media print {
        @page { size: A4; margin: 15mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-only { display: block !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  const getStatusBadge = (status: RFP["status"]) => {
    const config = {
      submitted: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "Submitted",
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
    const style = config[status];
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

  const handleView = (rfp: RFP) => {
    setSelectedRfp(rfp);
    setViewDialogOpen(true);
  };

  const handleReviewOrders = () => {
    setApprovedPODialogOpen(true);
  };

  const handleCreateRFP = (order: Order) => {
    console.log("Creating RFP from PO:", order.id);
    setApprovedPODialogOpen(false);
    router.push(
      `/home/finance/request-for-payment/create-rfp?orderId=${order.id}`,
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
      value: rfps.filter((r) => r.status === "submitted").length,
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

  const columns: Column<RFP>[] = [
    {
      key: "id",
      header: "RFP Reference",
      width: "w-[140px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-slate-900">
            {row.id}
          </span>
          <span className="text-[10px] text-slate-500">PO: {row.orderId}</span>
        </div>
      ),
    },
    {
      key: "rfpTitle",
      header: "Description",
      width: "min-w-[240px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">
            {row.rfpTitle}
          </span>
          <span className="text-xs text-slate-500 truncate max-w-50">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      key: "paymentType",
      header: "Payment Method",
      width: "w-[130px]",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{row.paymentType}</span>
        </div>
      ),
    },
    {
      key: "requestor",
      header: "Requestor",
      width: "w-[160px]",
      render: (row) => (
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {row.requestor
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-slate-900">
              {row.requestor}
            </span>
            <span className="text-xs text-slate-500">{row.department}</span>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-[120px]",
      render: (row) => (
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-slate-900">
            {row.amount}
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
      header: "Date",
      width: "w-[110px]",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm">{formatDate(row.dateSubmitted)}</span>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { value: "submitted", label: "Pending Review" },
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
          <Card key={stat.title} className={`shadow-sm bg-white`}>
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
        searchPlaceholder="Search by RFP ID, title, vendor, or requestor..."
        searchable
        searchKeys={[
          "id",
          "rfpTitle",
          "paymentType",
          "requestor",
          "department",
          "vendor",
          "invoiceNumber",
          "description",
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
            Create from PO
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
                    {selectedRfp?.id}
                  </span>
                </DialogDescription>
              </div>
              {selectedRfp && (
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold font-mono text-slate-900">
                    {formatCurrency(selectedRfp.amount)}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* ✅ PRINTABLE CONTENT - This is what gets printed */}
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
                          {selectedRfp.payableTo}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Vendor
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedRfp.vendor}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Contact
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedRfp.contactNumber}
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
                          {selectedRfp.paymentType}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Invoice Number
                        </label>
                        <p className="text-sm text-slate-700">
                          {selectedRfp.invoiceNumber || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Due Date
                        </label>
                        <p className="text-sm text-slate-700 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {formatDate(selectedRfp.dueDate)}
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
                        {selectedRfp.requestor}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedRfp.department}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                        Request Date
                      </label>
                      <p className="text-sm text-slate-700">
                        {formatDate(selectedRfp.requestDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                        Submitted
                      </label>
                      <p className="text-sm text-slate-700">
                        {formatDate(selectedRfp.dateSubmitted)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {selectedRfp.lineItems?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Itemized Expenses
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase w-25">
                              Ref Doc
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase">
                              Particulars
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-center w-15">
                              Qty
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-25">
                              Unit Price
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-25">
                              Amount
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase w-25">
                              Charge To
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRfp.lineItems.map((item) => (
                            <TableRow key={item.id} className="text-[11px]">
                              <TableCell className="font-mono text-slate-600">
                                {item.referenceDocument}
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
                                {formatCurrency(item.totalAmount)}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {item.chargeTo}
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
                            {formatCurrency(selectedRfp.totalPayable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Journal Entries */}
                {selectedRfp.journalEntry?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      Accounting Distribution
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase w-20">
                              Entry #
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase">
                              Account Title
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-30">
                              Debit
                            </TableHead>
                            <TableHead className="text-[10px] font-bold text-slate-600 uppercase text-right w-30">
                              Credit
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRfp.journalEntry.map((entry) => (
                            <TableRow key={entry.id} className="text-[11px]">
                              <TableCell className="font-mono text-slate-600">
                                #{entry.id}
                              </TableCell>
                              <TableCell className="text-slate-900">
                                {entry.accountTitle}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {entry.entryType === "debit"
                                  ? formatCurrency(entry.amount)
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {entry.entryType === "credit"
                                  ? formatCurrency(entry.amount)
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Approval Info */}
                {selectedRfp.approvedBy && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      {selectedRfp.status === "approved"
                        ? "Approval"
                        : "Rejection"}{" "}
                      Details
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRfp.approvedBy}
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedRfp.status === "approved"
                            ? "Approved on"
                            : "Rejected on"}{" "}
                          {formatDate(selectedRfp.approvedDate!)}
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
            <div className="flex mb-4 mr-4 gap-2">
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
      <Dialog
        open={approvedPODialogOpen}
        onOpenChange={setApprovedPODialogOpen}
      >
        <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  Approved Purchase Orders
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select an approved PO to generate a new payment request
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-200 text-slate-700 font-semibold"
              >
                {mockPurchaseOrders.length} available
              </Badge>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-transparent border-b border-slate-200">
                    <TableHead className="font-semibold text-xs text-slate-600 py-4 w-30">
                      PO Reference
                    </TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 py-4">
                      Description
                    </TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 py-4 w-30">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 py-4 text-right w-35">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 py-4 text-right w-35">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseOrders.map((po) => (
                    <TableRow key={po.id} className="group hover:bg-slate-50">
                      <TableCell className="py-4">
                        <span className="font-mono text-sm font-semibold text-slate-900">
                          {po.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {po.poTitle}
                          </span>
                          <span className="text-xs text-slate-500 truncate max-w-62.5">
                            {po.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-300 text-slate-600 font-medium"
                        >
                          {po.poType}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="font-mono text-sm font-semibold text-slate-900">
                          {po.totalAmount}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleCreateRFP(po)}
                          className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
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

          <DialogFooter className="px-6 py-4 border-t bg-slate-50">
            <Button
              variant="outline"
              onClick={() => setApprovedPODialogOpen(false)}
              className="border-slate-300"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

// Utility for currency formatting
const formatCurrency = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === "") return "₱0.00";
  if (typeof value === "number")
    return isNaN(value)
      ? "₱0.00"
      : new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(value);

  const cleanedValue = value
    .toString()
    .replace(/[₱$,\s]/g, "")
    .trim();
  if (!cleanedValue) return "₱0.00";

  const numValue = parseFloat(cleanedValue);
  return isNaN(numValue)
    ? "₱0.00"
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(numValue);
};
