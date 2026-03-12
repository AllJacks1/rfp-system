"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Calendar,
  User,
  DollarSign,
  FileText,
  Truck,
  CreditCard,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
  Printer,
  TableIcon,
  Plus,
  ArrowLeftRight,
  Trash2,
  Save,
  Coins,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface JournalEntry {
  id: number;
  accountTitle: string;
  amount: number;
  entryType: "debit" | "credit";
}

interface RequestItem {
  item: string;
  description: string;
  unit: string;
  quantity: string;
  estimatedUnitPrice: string;
}

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
  preferredDate: string;
  expectedCompletion: string;
  attachment: string[];
  plateNumber: string;
  carType: string;
  ownerFirstname: string;
  ownerLastname: string;
  preferredVendor: string;
  vendorContactPerson: string;
  requiredBy: string;
  paymentMethod: string;
  items: RequestItem[];
  totalEstimatedCost: string;
}

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
    preferredDate: "2024-03-18",
    expectedCompletion: "2024-03-25",
    attachment: ["laptop-specs.pdf", "laptop-specs.pdf"],
    plateNumber: "",
    carType: "",
    ownerFirstname: "",
    ownerLastname: "",
    preferredVendor: "Dell Technologies",
    vendorContactPerson: "Michael Reyes",
    requiredBy: "2024-03-25",
    paymentMethod: "Bank Transfer",
    items: [
      {
        item: "Dell XPS 15",
        description: "Intel i7, 32GB RAM, 1TB SSD",
        unit: "pcs",
        quantity: "5",
        estimatedUnitPrice: "$2,300",
      },
      {
        item: "Laptop Docking Station",
        description: "USB-C docking station",
        unit: "pcs",
        quantity: "5",
        estimatedUnitPrice: "$150",
      },
    ],
    totalEstimatedCost: "$12,250",
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
    preferredDate: "2024-03-12",
    expectedCompletion: "2024-03-14",
    attachment: [],
    plateNumber: "",
    carType: "",
    ownerFirstname: "",
    ownerLastname: "",
    preferredVendor: "Office Warehouse",
    vendorContactPerson: "Ana Santos",
    requiredBy: "2024-03-15",
    paymentMethod: "Company Credit Card",
    items: [
      {
        item: "Printer Paper",
        description: "A4 80gsm",
        unit: "ream",
        quantity: "20",
        estimatedUnitPrice: "$5",
      },
      {
        item: "Ballpoint Pens",
        description: "Blue ink",
        unit: "box",
        quantity: "10",
        estimatedUnitPrice: "$8",
      },
      {
        item: "Staplers",
        description: "Standard office stapler",
        unit: "pcs",
        quantity: "5",
        estimatedUnitPrice: "$12",
      },
    ],
    totalEstimatedCost: "$850",
  },
  {
    id: "REQ-2024-003",
    title: "Vehicle Tire Replacement",
    type: "Vehicle Maintenance",
    priority: "High",
    status: "approved",
    dateSubmitted: "2024-03-07",
    requestor: "Carlos Mendoza",
    company: "TechNova Logistics",
    department: "Operations",
    amount: "$1,200",
    description: "Replace worn-out tires for delivery vehicle.",
    preferredDate: "2024-03-11",
    expectedCompletion: "2024-03-11",
    attachment: ["vehicle-inspection.jpg", "vehicle-inspection.jpg"],
    plateNumber: "ABC-1234",
    carType: "Toyota Hilux",
    ownerFirstname: "Carlos",
    ownerLastname: "Mendoza",
    preferredVendor: "Goodyear Service Center",
    vendorContactPerson: "Luis Ramirez",
    requiredBy: "2024-03-11",
    paymentMethod: "Bank Transfer",
    items: [
      {
        item: "All-Terrain Tire",
        description: "265/65R17 Goodyear Wrangler",
        unit: "pcs",
        quantity: "4",
        estimatedUnitPrice: "$250",
      },
      {
        item: "Chrome Valve Stems",
        description: "Heavy-duty chrome valve stems",
        unit: "set",
        quantity: "4",
        estimatedUnitPrice: "$12",
      },
      {
        item: "Tire Pressure Sensors",
        description: "TPMS sensors for Toyota Hilux",
        unit: "pcs",
        quantity: "4",
        estimatedUnitPrice: "$45",
      },
    ],
    totalEstimatedCost: "$1,663",
  },
  {
    id: "REQ-2024-004",
    title: "Marketing Campaign Printing",
    type: "Marketing Materials",
    priority: "Medium",
    status: "approved",
    dateSubmitted: "2024-03-11",
    requestor: "Emily Garcia",
    company: "TechNova Solutions",
    department: "Marketing",
    amount: "$2,000",
    description: "Printing brochures and flyers for Q2 campaign.",
    preferredDate: "2024-03-20",
    expectedCompletion: "2024-03-22",
    attachment: ["campaign-design.pdf", "campaign-design.pdf"],
    plateNumber: "",
    carType: "",
    ownerFirstname: "",
    ownerLastname: "",
    preferredVendor: "PrintHub Davao",
    vendorContactPerson: "Kevin Tan",
    requiredBy: "2024-03-22",
    paymentMethod: "Credit Card",
    items: [
      {
        item: "Tri-Fold Brochures",
        description: "Full color glossy",
        unit: "pcs",
        quantity: "2000",
        estimatedUnitPrice: "$0.60",
      },
      {
        item: "Flyers",
        description: "A5 promotional flyers",
        unit: "pcs",
        quantity: "1500",
        estimatedUnitPrice: "$0.40",
      },
    ],
    totalEstimatedCost: "$1,800",
  },
  {
    id: "REQ-2024-005",
    title: "Aircon Maintenance Service",
    type: "Facility Maintenance",
    priority: "Low",
    status: "approved",
    dateSubmitted: "2024-03-05",
    requestor: "David Lee",
    company: "TechNova Solutions",
    department: "Facilities",
    amount: "$600",
    description:
      "Routine cleaning and maintenance of office air conditioning units.",
    preferredDate: "2024-03-15",
    expectedCompletion: "2024-03-15",
    attachment: [],
    plateNumber: "",
    carType: "",
    ownerFirstname: "",
    ownerLastname: "",
    preferredVendor: "CoolAir Services",
    vendorContactPerson: "Mark Lopez",
    requiredBy: "2024-03-16",
    paymentMethod: "Bank Transfer",
    items: [
      {
        item: "Aircon Cleaning",
        description: "Split-type AC cleaning",
        unit: "unit",
        quantity: "6",
        estimatedUnitPrice: "$70",
      },
      {
        item: "Freon Refill",
        description: "R410 refrigerant refill",
        unit: "service",
        quantity: "1",
        estimatedUnitPrice: "$150",
      },
    ],
    totalEstimatedCost: "$570",
  },
];

const statusConfig = {
  submitted: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircle,
    label: "Submitted",
  },
  approved: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
    label: "Approved",
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Rejected",
  },
};

const priorityConfig = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
};

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

const COMPANY_INFO = {
  name: "Astra Business Solutions",
  tagline: "Innovative Business Solutions",
  address: "iHub at Pines Place, Pioneer Dr, Bajada",
  city: "Davao City",
  country: "Philippines",
  postalCode: "8000",
  phone: "+63 985-571-3768",
  email: "info@technova-solutions.com",
  logo: "/astra_logo_small.png", // Replace with your actual logo path
};

// Printable Content Component
const PrintableContent = ({
  request,
  formatCurrency,
  purchaseOrderNumber,
}: {
  request: Request;
  entries: JournalEntry[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  formatCurrency: (value: string | number | undefined | null) => string;
  purchaseOrderNumber: string;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="print-content bg-white text-black min-h-[277mm] w-[210mm] mx-auto p-[15mm] box-border text-[12px] leading-normal flex flex-col">
      {/* HEADER */}
      <div className="border-b-2 border-blue-900 pb-3 mb-4 flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <Image
            src="/astra_logo_small.png"
            alt="Logo"
            width={48}
            height={48}
            priority
            className="rounded"
          />
          <div>
            <h1 className="text-lg font-bold text-blue-900 uppercase tracking-wide">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-[10px] text-gray-600 italic">
              {COMPANY_INFO.tagline}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[10px] text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {COMPANY_INFO.address}, {COMPANY_INFO.city}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {COMPANY_INFO.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-2 border-blue-900 rounded-lg px-4 py-2 text-center min-w-[140px]">
          <p className="text-[10px] text-gray-600 uppercase font-bold">
            Purchase Order
          </p>
          <p className="text-lg font-bold text-blue-900">
            {purchaseOrderNumber}
          </p>
          <p className="text-[10px] text-gray-500">{today}</p>
        </div>
      </div>

      {/* TITLE & STATUS */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest inline-block px-8 pb-1">
          Official Purchase Order
        </h2>
      </div>

      {/* Purchase INFO */}
      <div className="mb-5">
          <h3 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-200 mb-2 pb-1 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Purchase Details
          </h3>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h4 className="text-base font-bold text-gray-900 mb-1">
            {request.title}
          </h4>
          <p className="text-gray-700 text-sm mb-3">{request.description}</p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28">
                Purchase Type:
              </span>
              <span>{request.type}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28">
                Department:
              </span>
              <span>{request.department}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28">
                Date Submitted:
              </span>
              <span>{formatDate(request.dateSubmitted)}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28">
                Required By:
              </span>
              <span className="text-red-700 font-semibold">
                {formatDate(request.requiredBy)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-200 mb-2 pb-1 flex items-center gap-2">
          <TableIcon className="h-4 w-4" />
          Line Items ({request.items.length} items)
        </h3>
        <table className="w-full border-collapse border-2 border-gray-400">
          <thead>
            <tr className="bg-blue-50">
              <th className="border-2 border-gray-400 px-2 py-2 text-center font-bold text-gray-800 w-10">
                #
              </th>
              <th className="border-2 border-gray-400 px-2 py-2 text-left font-bold text-gray-800">
                Item Description
              </th>
              <th className="border-2 border-gray-400 px-2 py-2 text-center font-bold text-gray-800 w-16">
                Qty
              </th>
              <th className="border-2 border-gray-400 px-2 py-2 text-right font-bold text-gray-800 w-24">
                Unit Price
              </th>
              <th className="border-2 border-gray-400 px-2 py-2 text-right font-bold text-gray-800 w-24">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((item, index) => {
              const qty = parseFloat(item.quantity) || 0;
              const price =
                parseFloat(item.estimatedUnitPrice.replace(/[$,]/g, "")) || 0;
              const total = qty * price;
              return (
                <tr key={index} className="bg-white">
                  <td className="border-2 border-gray-400 px-2 py-2 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="border-2 border-gray-400 px-2 py-2">
                    <p className="font-semibold text-gray-900">{item.item}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </td>
                  <td className="border-2 border-gray-400 px-2 py-2 text-center">
                    {item.quantity}{" "}
                    <span className="text-xs uppercase">{item.unit}</span>
                  </td>
                  <td className="border-2 border-gray-400 px-2 py-2 text-right font-mono">
                    {formatCurrency(item.estimatedUnitPrice)}
                  </td>
                  <td className="border-2 border-gray-400 px-2 py-2 text-right font-mono font-bold">
                    {formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end mt-3">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-2 min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-900">TOTAL AMOUNT:</span>
              <span className="font-mono font-bold text-lg text-blue-900">
                {formatCurrency(request.totalEstimatedCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PARTIES - Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="border-2 border-gray-300 rounded-lg p-3">
          <h4 className="font-bold text-blue-900 text-xs uppercase border-b border-gray-200 mb-2 pb-1">
            Requestor / Client
          </h4>
          <p className="font-bold text-base text-gray-900">
            {request.requestor}
          </p>
          <p className="text-xs text-gray-600">
            {request.department} Department
          </p>
          <p className="text-xs text-gray-600">{request.company}</p>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 uppercase font-semibold">
              Authorized Signature
            </p>
            <div className="h-10 border-b-2 border-gray-400 mt-1"></div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">
                Date: ___________
              </span>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-300 rounded-lg p-3">
            <h4 className="font-bold text-blue-900 text-xs uppercase border-b border-gray-200 mb-2 pb-1">
              Supplier
            </h4>
          <p className="font-bold text-base text-gray-900">
            {request.preferredVendor}
          </p>
          <p className="text-xs text-gray-600">
            Contact: {request.vendorContactPerson}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {request.paymentMethod}
          </p>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 uppercase font-semibold">
              Vendor Acknowledgment
            </p>
            <div className="h-10 border-b-2 border-gray-400 mt-1"></div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">
                Date: ___________
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TERMS & CONDITIONS */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-gray-700 uppercase border-b border-gray-300 mb-2 pb-1">
          Terms & Conditions
        </h3>
        <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
          <li>
            Goods must be delivered by the required date specified above.
          </li>
          <li>
            All goods shall meet specifications and quality standards.
          </li>
            <li>
              Invoices must reference this Purchase Order number for payment
              processing.
            </li>
          <li>
            Any changes to scope must be approved in writing by the authorized
            requestor.
          </li>
          <li>
            {COMPANY_INFO.name} reserves the right to inspect all work before
            final payment.
          </li>
        </ol>
      </div>

      {/* SPACER - Pushes footer to bottom when content is short */}
      <div className="flex-grow"></div>

      {/* FOOTER */}
      <div className="pt-3 border-t-2 border-blue-900">
        <div className="flex justify-between items-center text-[10px] text-gray-500">
          <div>
            <p className="font-semibold text-blue-900">{COMPANY_INFO.name}</p>
          </div>
          <div className="text-center">
            <p>This is an official document. Please retain for your records.</p>
            <p>Generated on {today} | Page 1 of 1</p>
          </div>
          <div className="text-right">
            <p>Questions? Contact Finance</p>
            <p>{COMPANY_INFO.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RequestDetailsPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accountTitle, setAccountTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [entryType, setEntryType] = useState<"debit" | "credit">("debit");

  // react-to-print setup
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Request_${requestId || "Details"}`,
    pageStyle: `
      @media print {
        @page { size: A4; margin: 10mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-content { padding: 0 !important; }
      }
    `,
  });

  const request = useMemo(() => {
    return mockRequests.find((r) => r.id === requestId);
  }, [requestId]);

  const handleAddRow = () => {
    if (!accountTitle || !amount) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newEntry: JournalEntry = {
      id: Date.now(),
      accountTitle,
      amount: parsedAmount,
      entryType,
    };
    setEntries([...entries, newEntry]);
    setAccountTitle("");
    setAmount("");
    setEntryType("debit");
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const totalDebits = entries
    .filter((e) => e.entryType === "debit")
    .reduce((sum, e) => sum + (isNaN(e.amount) ? 0 : e.amount), 0);

  const totalCredits = entries
    .filter((e) => e.entryType === "credit")
    .reduce((sum, e) => sum + (isNaN(e.amount) ? 0 : e.amount), 0);

  const isBalanced = totalDebits === totalCredits && entries.length > 0;

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

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {requestId
                ? `No request found with ID: ${requestId}`
                : "No request ID provided"}
            </p>
            <Link href="/home/finance/purchase-orders">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Requests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[request.status].icon;
  const isVehicleRequest = request.type === "Vehicle Maintenance";

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Actions - Hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/home/finance/purchase-orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Request Details</h1>
            <p className="text-sm text-muted-foreground">
              Viewing {request.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Hidden Printable Content */}
      <div className="hidden">
        <div ref={contentRef}>
        <PrintableContent
            request={request}
            entries={entries}
            totalDebits={totalDebits}
            totalCredits={totalCredits}
            isBalanced={isBalanced}
            formatCurrency={formatCurrency}
            purchaseOrderNumber={requestId || "N/A"}
          />
        </div>
      </div>

      {/* Screen Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Overview Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {request.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {request.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={statusConfig[request.status].color}
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[request.status].label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      priorityConfig[
                        request.priority as keyof typeof priorityConfig
                      ]
                    }
                  >
                    {request.priority} Priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Request Type"
                  value={request.type}
                  icon={Package}
                />
                <DetailItem
                  label="Department"
                  value={request.department}
                  icon={Building2}
                />
                <DetailItem
                  label="Date Submitted"
                  value={new Date(request.dateSubmitted).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                  icon={Calendar}
                />
                <DetailItem
                  label="Required By"
                  value={new Date(request.requiredBy).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          {isVehicleRequest && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem
                    label="Plate Number"
                    value={request.plateNumber}
                  />
                  <DetailItem label="Vehicle Type" value={request.carType} />
                  <DetailItem
                    label="Owner Name"
                    value={`${request.ownerFirstname} ${request.ownerLastname}`.trim()}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Requested Items
              </CardTitle>
              <CardDescription>
                {request.items.length} item
                {request.items.length !== 1 ? "s" : ""} in this request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.items.map((item, index) => {
                      const qty = parseFloat(item.quantity) || 0;
                      const price =
                        parseFloat(
                          item.estimatedUnitPrice.replace(/[$,]/g, ""),
                        ) || 0;
                      const total = qty * price;
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.item}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.estimatedUnitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(total)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="bg-muted/50 rounded-lg p-4 min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Estimated Cost:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(request.totalEstimatedCost)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {request.attachment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.attachment.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file}</p>
                        <p className="text-xs text-muted-foreground">
                          Click to download
                        </p>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requestor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {request.requestor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{request.requestor}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.department}
                  </p>
                </div>
              </div>
              <Separator />
              <DetailItem
                label="Company"
                value={request.company}
                icon={Building2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Preferred Vendor"
                value={request.preferredVendor}
                icon={Building2}
              />
              <DetailItem
                label="Contact Person"
                value={request.vendorContactPerson}
                icon={User}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Payment Method"
                value={request.paymentMethod}
                icon={CreditCard}
              />
              <DetailItem
                label="Amount"
                value={formatCurrency(request.amount)}
                icon={DollarSign}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Journal Entry Section */}
      <div className="mt-6 print:hidden">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Journal Entry</CardTitle>
                  <CardDescription>
                    Record double-entry bookkeeping transaction
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Accounting
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Account Title
                </Label>
                <Select value={accountTitle} onValueChange={setAccountTitle}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="accounts-receivable">
                      Accounts Receivable
                    </SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="accounts-payable">
                      Accounts Payable
                    </SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  Amount
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  Entry Type
                </Label>
                <Select
                  value={entryType}
                  onValueChange={(value: "debit" | "credit") =>
                    setEntryType(value)
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Debit
                      </div>
                    </SelectItem>
                    <SelectItem value="credit">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        Credit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleAddRow}
                disabled={!accountTitle || !amount}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry to Table
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  Journal Entries ({entries.length})
                </Label>
                {entries.length > 0 && (
                  <Badge
                    variant={isBalanced ? "default" : "destructive"}
                    className={
                      isBalanced
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {isBalanced ? "Balanced" : "Unbalanced"}
                  </Badge>
                )}
              </div>

              <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 hover:bg-slate-100">
                      <TableHead className="w-12 text-center font-bold text-slate-700">
                        #
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Account Title
                      </TableHead>
                      <TableHead className="w-40 text-right font-bold text-green-700">
                        Debit
                      </TableHead>
                      <TableHead className="w-40 text-right font-bold text-red-700">
                        Credit
                      </TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                            <p>
                              No entries yet. Fill the form above and click
                              &quot;Add Entry&quot;.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry, index) => (
                        <TableRow
                          key={entry.id}
                          className="group hover:bg-slate-50/50"
                        >
                          <TableCell className="text-center text-muted-foreground font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium capitalize">
                            {entry.accountTitle.replace(/-/g, " ")}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono font-semibold ${entry.entryType === "debit" ? "text-green-700 bg-green-50/30" : "text-slate-300"}`}
                          >
                            {entry.entryType === "debit"
                              ? formatCurrency(entry.amount)
                              : "—"}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono font-semibold ${entry.entryType === "credit" ? "text-red-700 bg-red-50/30" : "text-slate-300"}`}
                          >
                            {entry.entryType === "credit"
                              ? formatCurrency(entry.amount)
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {entries.length > 0 && (
                      <TableRow className="bg-slate-50 font-bold border-t-2">
                        <TableCell></TableCell>
                        <TableCell className="text-slate-700">TOTAL</TableCell>
                        <TableCell
                          className={`text-right font-mono ${totalDebits === totalCredits ? "text-green-700" : "text-orange-600"}`}
                        >
                          {formatCurrency(totalDebits)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono ${totalDebits === totalCredits ? "text-red-700" : "text-orange-600"}`}
                        >
                          {formatCurrency(totalCredits)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {entries.length > 0 && (
                <div className="flex justify-end pt-2">
                  <div
                    className={`rounded-lg p-4 min-w-[280px] space-y-2 border ${isBalanced ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Total Debits
                      </span>
                      <span className="font-mono font-semibold text-green-700">
                        {formatCurrency(totalDebits)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        Total Credits
                      </span>
                      <span className="font-mono font-semibold text-red-700">
                        {formatCurrency(totalCredits)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Difference</span>
                      <span
                        className={`font-mono font-bold ${isBalanced ? "text-green-600" : "text-orange-600"}`}
                      >
                        {formatCurrency(Math.abs(totalDebits - totalCredits))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setEntries([])}>
                Clear All
              </Button>
              <Button disabled={!isBalanced || entries.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Journal Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
