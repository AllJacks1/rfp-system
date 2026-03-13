import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Phone,
  Calendar,
  User,
  Building2,
  CreditCard,
  FileText,
  Hash,
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
  invoiceNumber?: string;
  approvedBy?: string;
  approvedDate?: string;
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

const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return "₱0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(num);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const PrintRequestForPayment = ({ rfp }: { rfp: RFP }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white text-slate-900 w-[210mm] min-h-[297mm] mx-auto p-[10mm] box-border text-[10px] leading-tight flex flex-col">
      {/* COMPACT HEADER */}
      <header className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src={COMPANY_INFO.logo}
              alt={COMPANY_INFO.name}
              width={40}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-[9px] text-slate-500 italic leading-none">
              {COMPANY_INFO.tagline}
            </p>
            <div className="mt-1 text-[8px] text-slate-600 space-x-3">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5" />
                {COMPANY_INFO.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" />
                {COMPANY_INFO.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Reference Boxes */}
        <div className="text-right space-y-1.5">
          <div className="flex gap-2">
            <div className="bg-white border border-slate-300 rounded px-3 py-1.5 inline-block ml-2">
            <p className="text-[8px] uppercase tracking-wider text-slate-500 leading-none">
              PO Ref
            </p>
            <p className="text-base font-bold font-mono text-slate-900 leading-tight">
              {rfp.orderId}
            </p>
          </div>
          <div className="bg-[#2B3A9F] text-white rounded px-3 py-1.5 inline-block">
            <p className="text-[8px] uppercase tracking-wider text-slate-400 leading-none">
              RFP Ref
            </p>
            <p className="text-base font-bold font-mono leading-tight">
              {rfp.id}
            </p>
          </div>
          </div>
          <p className="text-[8px] text-slate-400 mt-1">{today}</p>
        </div>
      </header>

      {/* TITLE */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 inline-block pb-1 px-6">
          Request for Payment
        </h2>
      </div>

      {/* 3-COLUMN INFO GRID - More Compact */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Payee */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <User className="h-3 w-3" />
            Payee
          </h3>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-900 leading-tight">
              {rfp.payableTo}
            </p>
            <p className="text-[9px] text-slate-600">{rfp.contactNumber}</p>
            <p className="text-[9px] text-slate-500">{rfp.department}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Payment
          </h3>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-900">
              {rfp.paymentType}
            </p>
            <p className="text-[9px] text-slate-600 flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              Due: {formatDate(rfp.dueDate)}
            </p>
            <p className="text-[9px] text-slate-500 font-mono">
              INV: {rfp.invoiceNumber || "-"}
            </p>
          </div>
        </div>

        {/* Requestor */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Request
          </h3>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-900">
              {rfp.requestor}
            </p>
            <p className="text-[9px] text-slate-600">
              {formatDate(rfp.requestDate)}
            </p>
            <p className="text-[9px] text-slate-500">Dept: {rfp.department}</p>
          </div>
        </div>
      </div>

      {/* NOTES - Compact */}
      <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
        <p className="text-[8px] text-amber-800 leading-tight">
          <span className="font-semibold">Note:</span> Cheque advances require
          liquidation within 3 days. Fund transfers require liquidation within
          24 hours.
        </p>
      </div>

      {/* LINE ITEMS - Tighter Table */}
      <div className="mb-3">
        <h3 className="text-[9px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Itemized Expenses
        </h3>
        <div className="border rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2">
                  Ref
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2">
                  Particulars
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 text-center w-10">
                  Qty
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 text-right w-20">
                  Price
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 text-right w-20">
                  Amount
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 w-22.5">
                  Charge To
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfp.lineItems.map((item) => (
                <TableRow key={item.id} className="text-[9px]">
                  <TableCell className="py-1 px-2 font-mono text-slate-600">
                    {rfp.orderId}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-slate-900">
                    {item.particulars}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-center">
                    {item.qty}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-right font-mono">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-right font-mono font-medium">
                    {formatCurrency(item.totalAmount)}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-slate-600 text-[8px]">
                    {item.chargeTo}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-1.5">
          <div className="bg-[#2B3A9F] text-white px-4 py-1.5 rounded">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-300 mr-2">
              Total
            </span>
            <span className="text-base font-bold font-mono">
              {formatCurrency(rfp.totalPayable)}
            </span>
          </div>
        </div>
      </div>

      {/* JOURNAL ENTRIES - Side by Side if Space Permits */}
      <div className="mb-3">
        <h3 className="text-[9px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Hash className="h-3 w-3" />
          Journal Entry
        </h3>
        <div className="border rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 w-12.5">
                  #
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2">
                  Account
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 text-right w-22.5">
                  Debit
                </TableHead>
                <TableHead className="text-[8px] font-bold text-slate-700 uppercase py-1 px-2 text-right w-22.5">
                  Credit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfp.journalEntry.map((entry) => (
                <TableRow key={entry.id} className="text-[9px]">
                  <TableCell className="py-1 px-2 font-mono text-slate-600">
                    #{entry.id}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-slate-900">
                    {entry.accountTitle}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-right font-mono">
                    {entry.entryType === "debit"
                      ? formatCurrency(entry.amount)
                      : "-"}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-right font-mono">
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

      {/* AUTHORIZATION - Horizontal Layout */}
      <div className="mb-3">
        <h3 className="text-[9px] font-bold text-slate-800 uppercase tracking-wider mb-2">
          Authorization
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {["Prepared By", "Reviewed By", "Approved By"].map((role) => (
            <div key={role} className="border border-slate-300 rounded p-2">
              <p className="text-[8px] text-slate-500 uppercase font-semibold mb-2">
                {role}
              </p>
              <div className="h-8 border-b border-slate-300 mb-1"></div>
              <p className="text-[7px] text-slate-400 text-center">Signature over Printed Name</p>
              <p className="text-[7px] text-slate-400 mt-1 text-center">
                Date: _______
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS - Compact Single Paragraph */}
      <div className="mb-3 p-2.5 bg-slate-50 rounded border border-slate-200">
        <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-1">
          Terms
        </h3>
        <p className="text-[8px] text-slate-600 leading-tight">
          1. Payment subject to document verification. 2. Expenses must comply
          with company policy. 3. Cash advances: 3 days (cheque), 24 hours
          (transfer). 4. Unliquidated advances deducted from payroll. 5.
          Official authorization for Finance. 6. Alterations must be initialed.
        </p>
      </div>

      {/* FOOTER - Compact */}
      <div className="mt-auto pt-3 border-t-2 border-slate-800">
        <div className="flex justify-between items-center text-[8px] text-slate-500">
          <div>
            <p className="font-bold text-slate-800 text-[9px]">
              {COMPANY_INFO.name}
            </p>
            <p>TIN: {COMPANY_INFO.taxId}</p>
          </div>
          <div className="text-center">
            <p className="italic">System-generated document</p>
            <p>{today} | Page 1 of 1</p>
          </div>
          <div className="text-right">
            <p>Finance: {COMPANY_INFO.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
