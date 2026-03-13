import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Building2,
  CreditCard,
  FileText,
  Hash,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

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
  logo: "/astra_logo_small.png",
  taxId: "000-123-456-789",
};

// Utility for currency formatting
const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return "₱0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(num);
};

// Utility for date formatting
const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const PrintServiceOrder = ({ rfp }: { rfp: RFP }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate totals for journal entries
  const totalDebits = rfp.journalEntry
    .filter((e) => e.entryType === "debit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = rfp.journalEntry
    .filter((e) => e.entryType === "credit")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="print-content bg-white text-slate-900 min-h-[297mm] w-[210mm] mx-auto p-10 box-border text-[11px] leading-relaxed flex flex-col shadow-2xl">
      {/* HEADER SECTION */}
      <header className="border-b-2 border-slate-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          {/* Company Info */}
          <div className="flex gap-4 items-start">
            <div className="relative w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
              <Image
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.name}
                width={64}
                height={64}
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                {COMPANY_INFO.name}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {COMPANY_INFO.tagline}
              </p>
              <div className="mt-2 space-y-0.5 text-[9px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>
                    {COMPANY_INFO.address}, {COMPANY_INFO.city}{" "}
                    {COMPANY_INFO.postalCode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <span>{COMPANY_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>{COMPANY_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Control */}
          <div className="text-right space-y-3">
            {/* RFP Reference */}
            <div className="bg-slate-900 text-white rounded-lg px-5 py-3 inline-block min-w-[180px]">
              <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 mb-1">
                RFP Reference No.
              </p>
              <p className="text-xl font-bold font-mono tracking-tight">
                {rfp.id}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-slate-400">
                <Calendar className="h-3 w-3" />
                <span>{today}</span>
              </div>
            </div>

            {/* Order Reference */}
            <div className="bg-white border-2 border-slate-200 rounded-lg px-5 py-3 inline-block min-w-[180px]">
              <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 mb-1">
                Order Reference No.
              </p>
              <p className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                {rfp.orderId}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-slate-400">
                <Calendar className="h-3 w-3" />
                <span>{today}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DOCUMENT TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-[0.2em] border-b-2 border-slate-300 inline-block pb-2 px-12">
          Request for Payment
        </h2>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
          Official Payment Authorization Document
        </p>
      </div>

      {/* PAYEE & PAYMENT DETAILS GRID */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column - Payee Information */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              Payee Information
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-semibold block">
                  Payable To
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {rfp.payableTo}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-semibold block">
                    Contact Number
                  </label>
                  <p className="text-[11px] text-slate-700">
                    {rfp.contactNumber || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-semibold block">
                    Department
                  </label>
                  <p className="text-[11px] text-slate-700">{rfp.department}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Requestor Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-semibold block">
                  Requested By
                </label>
                <p className="text-[11px] font-medium text-slate-900">
                  {rfp.requestor}
                </p>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-semibold block">
                  Request Date
                </label>
                <p className="text-[11px] text-slate-700">
                  {formatDate(rfp.requestDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Terms */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5" />
              Payment Terms
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">
                  Payment Method
                </span>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {rfp.paymentType}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">
                  Due Date
                </span>
                <span className="text-[11px] font-semibold text-slate-900 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {formatDate(rfp.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Notes Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-[9px] font-semibold text-amber-800 uppercase">
                  Important Notes
                </p>
                <p className="text-[9px] text-amber-700 leading-relaxed">
                  • Cheque to Employee: Cash advance for liquidation within 3
                  days
                </p>
                <p className="text-[9px] text-amber-700 leading-relaxed">
                  • Fund Transfer Request: Main to EWB Account (liquidation
                  within 24 hours)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" />
          Itemized Expenses
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase w-[80px]">
                  Ref Doc
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase">
                  Particulars
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase text-center w-[60px]">
                  Qty
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase text-right w-[100px]">
                  Unit Price
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase text-right w-[100px]">
                  Amount
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase w-[100px]">
                  Charge To
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfp.lineItems.map((item, index) => (
                <TableRow key={item.id} className="text-[10px]">
                  <TableCell className="font-mono text-slate-600">
                    {item.referenceDocument}
                  </TableCell>
                  <TableCell className="text-slate-900">
                    {item.particulars}
                  </TableCell>
                  <TableCell className="text-center">{item.qty}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(item.totalAmount)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {item.chargeTo}
                  </TableCell>
                </TableRow>
              ))}
              {rfp.lineItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-400 py-4 italic"
                  >
                    No line items recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end mt-3">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-lg min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Total Payable
              </span>
              <span className="text-lg font-bold font-mono">
                {formatCurrency(rfp.totalPayable)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JOURNAL ENTRIES */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Hash className="h-3.5 w-3.5" />
          Accounting Distribution (Journal Entry)
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase w-[80px]">
                  Entry #
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase">
                  Account Title
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase text-right w-[120px]">
                  Debit
                </TableHead>
                <TableHead className="text-[9px] font-bold text-slate-700 uppercase text-right w-[120px]">
                  Credit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfp.journalEntry.map((entry) => (
                <TableRow key={entry.id} className="text-[10px]">
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
              {/* Totals Row */}
              <TableRow className="bg-slate-50 font-semibold border-t-2 border-slate-200">
                <TableCell
                  colSpan={2}
                  className="text-right text-[9px] uppercase tracking-wider"
                >
                  Total
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatCurrency(totalDebits)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatCurrency(totalCredits)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {totalDebits !== totalCredits && (
          <p className="text-[9px] text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Warning: Journal entry is not balanced
          </p>
        )}
      </div>

      {/* AUTHORIZATION SECTION */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3">
          Authorization & Approval
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {["Prepared By", "Reviewed By", "Approved By"].map((role, index) => (
            <div
              key={role}
              className="border border-slate-300 rounded-lg p-3 bg-white"
            >
              <p className="text-[9px] text-slate-500 uppercase font-semibold mb-4">
                {role}
              </p>
              <div className="h-12 border-b border-slate-400 mb-2"></div>
              <p className="text-[9px] text-slate-400 text-center">Signature</p>
              <div className="mt-3 space-y-1">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-3 bg-slate-50 rounded w-1/2"></div>
              </div>
              <p className="text-[8px] text-slate-400 mt-2 text-center">
                Date: _____________
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS & CONDITIONS */}
      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3">
          Terms & Conditions
        </h3>
        <ol className="text-[9px] text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>
            Payment is subject to verification of all supporting documents and
            approval by authorized signatories.
          </li>
          <li>
            All expenses must comply with company policy and be supported by
            valid receipts/invoices.
          </li>
          <li>
            Cash advances must be liquidated within the specified timeframe (3
            days for cheque, 24 hours for fund transfers).
          </li>
          <li>
            Unliquidated advances will be deducted from subsequent payroll or
            reimbursements.
          </li>
          <li>
            This document serves as official authorization for the Finance
            Department to process the payment.
          </li>
          <li>
            Any alterations to this document must be initialed by the requestor
            and approver.
          </li>
        </ol>
      </div>

      {/* SPACER */}
      <div className="flex-grow"></div>

      {/* FOOTER */}
      <footer className="pt-4 border-t-2 border-slate-800 mt-auto">
        <div className="flex justify-between items-end text-[9px] text-slate-500">
          <div>
            <p className="font-bold text-slate-800">{COMPANY_INFO.name}</p>
            <p>TIN: {COMPANY_INFO.taxId}</p>
          </div>
          <div className="text-center">
            <p className="italic">This is a system-generated document.</p>
            <p>Generated on {today} | Page 1 of 1</p>
          </div>
          <div className="text-right">
            <p>Finance Department</p>
            <p>{COMPANY_INFO.phone}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Print-specific styles
const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .print-content {
      box-shadow: none !important;
      margin: 0 !important;
      width: 100% !important;
      min-height: 100vh !important;
    }
  }
`;
