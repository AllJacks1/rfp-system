import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
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
  name: "ASTRA BUSINESS SOLUTIONS, INC.",
  address: "iHub at Pines Place, Pioneer Drive, Bajada",
  city: "Davao City 8000",
  country: "Philippines",
  phone: "+63 (82) 985-571-3768",
  email: "finance@astra-business.com",
  logo: "/astra_logo_small.png",
  taxId: "TIN: 000-123-456-789",
};

const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return "0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

  // Calculate totals
  const totalQty = rfp.lineItems.reduce((sum, item) => sum + item.qty, 0);
  const totalDebits = rfp.journalEntry
    .filter((e) => e.entryType === "debit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = rfp.journalEntry
    .filter((e) => e.entryType === "credit")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto p-[8mm] box-border text-[8pt] leading-tight flex flex-col font-serif">
      {/* COMPACT CORPORATE HEADER */}
      <header className="border-b-2 border-black pb-2 mb-3 flex justify-between items-end">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 flex items-center justify-center border border-gray-300">
            <Image
              src={COMPANY_INFO.logo}
              alt={COMPANY_INFO.name}
              width={40}
              height={40}
              priority
              className="object-contain grayscale"
            />
          </div>
          <div>
            <h1 className="text-[11pt] font-bold text-black uppercase tracking-wider leading-none">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-[7pt] text-gray-700 leading-tight mt-0.5">
              {COMPANY_INFO.address}, {COMPANY_INFO.city}
            </p>
            <p className="text-[6pt] text-gray-600 leading-tight">
              Tel: {COMPANY_INFO.phone} | {COMPANY_INFO.taxId}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[6pt] text-gray-500 uppercase tracking-wider">RFP No.</p>
          <p className="text-[14pt] font-bold font-mono text-black leading-none">{rfp.id}</p>
          <p className="text-[6pt] text-gray-500 mt-0.5">{today}</p>
        </div>
      </header>

      {/* DOCUMENT TITLE */}
      <div className="text-center mb-3">
        <h2 className="text-[16pt] font-bold text-black uppercase tracking-widest">
          Request for Payment
        </h2>
        <div className="w-20 h-0.5 bg-black mx-auto mt-1"></div>
      </div>

      {/* REFERENCE BAR */}
      <div className="flex justify-between items-center border border-gray-400 p-1.5 mb-3 bg-gray-50">
        <div className="flex gap-4">
          <span><span className="text-[6pt] uppercase text-gray-600 font-semibold">PO Ref:</span> <span className="font-mono font-bold">{rfp.orderId}</span></span>
          <span><span className="text-[6pt] uppercase text-gray-600 font-semibold">Invoice:</span> <span className="font-mono">{rfp.invoiceNumber || "N/A"}</span></span>
        </div>
        <span><span className="text-[6pt] uppercase text-gray-600 font-semibold">Payment:</span> <span className="font-bold uppercase">{rfp.paymentType}</span></span>
      </div>

      {/* PAYEE & REQUESTOR - Compact */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="border border-gray-400 p-2">
          <p className="text-[6pt] uppercase text-gray-600 font-semibold border-b border-gray-300 pb-0.5 mb-1">Payee</p>
          <p className="text-[10pt] font-bold text-black leading-tight">{rfp.payableTo}</p>
          <p className="text-[7pt] text-gray-700">{rfp.contactNumber}</p>
        </div>
        <div className="border border-gray-400 p-2">
          <p className="text-[6pt] uppercase text-gray-600 font-semibold border-b border-gray-300 pb-0.5 mb-1">Requestor</p>
          <p className="text-[10pt] font-bold text-black leading-tight">{rfp.requestor}</p>
          <p className="text-[7pt] text-gray-700">{formatDate(rfp.requestDate)}</p>
        </div>
      </div>

      {/* PAYMENT DETAILS - Single row */}
      <div className="grid grid-cols-4 gap-2 mb-3 border border-gray-400 p-2">
        <div>
          <p className="text-[6pt] uppercase text-gray-600 font-semibold">Due Date</p>
          <p className="text-[9pt] font-bold">{formatDate(rfp.dueDate)}</p>
        </div>
        <div>
          <p className="text-[6pt] uppercase text-gray-600 font-semibold">Department</p>
          <p className="text-[9pt]">{rfp.department}</p>
        </div>
        <div>
          <p className="text-[6pt] uppercase text-gray-600 font-semibold">Total Items</p>
          <p className="text-[9pt] font-bold">{rfp.lineItems.length}</p>
        </div>
        <div className="text-right">
          <p className="text-[6pt] uppercase text-gray-600 font-semibold">Amount Due</p>
          <p className="text-[12pt] font-bold font-mono text-black">{formatCurrency(rfp.totalPayable)}</p>
        </div>
      </div>

      {/* STATEMENT OF ACCOUNT - Compact with footer total */}
      <div className="mb-3 flex-1">
        <p className="text-[7pt] font-bold text-black uppercase tracking-wider mb-1">
          Statement of Account
        </p>
        <div className="border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-400">
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-center w-6">#</TableHead>
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1">Description / Ref</TableHead>
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-center w-8">Qty</TableHead>
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-right w-16">Price</TableHead>
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-right w-16">Amount</TableHead>
                <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 w-20">Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfp.lineItems.map((item, index) => (
                <TableRow key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <TableCell className="py-0.5 px-1 text-center text-gray-700">{index + 1}</TableCell>
                  <TableCell className="py-0.5 px-1">
                    <p className="font-semibold text-[8pt] leading-tight">{item.particulars}</p>
                    <p className="text-[6pt] text-gray-600 leading-none">Ref: {item.referenceDocument}</p>
                  </TableCell>
                  <TableCell className="py-0.5 px-1 text-center">{item.qty}</TableCell>
                  <TableCell className="py-0.5 px-1 text-right font-mono text-[7pt]">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="py-0.5 px-1 text-right font-mono font-semibold text-[7pt]">{formatCurrency(item.totalAmount)}</TableCell>
                  <TableCell className="py-0.5 px-1 text-[6pt] text-gray-700 leading-tight">{item.chargeTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-100 border-t-2 border-black">
                <TableCell colSpan={2} className="py-1 px-1 text-right font-bold text-[7pt] uppercase">
                  Total Items: {totalQty}
                </TableCell>
                <TableCell colSpan={2} className="py-1 px-1 text-right font-bold text-[7pt] uppercase">
                  Total Payable
                </TableCell>
                <TableCell className="py-1 px-1 text-right font-mono font-bold text-[9pt]">
                  {formatCurrency(rfp.totalPayable)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* ACCOUNTING DISTRIBUTION - Horizontal layout for many entries */}
      <div className="mb-3">
        <p className="text-[7pt] font-bold text-black uppercase tracking-wider mb-1">
          General Ledger Distribution
        </p>
        
        {/* If many entries, use compact horizontal layout */}
        {rfp.journalEntry.length > 6 ? (
          <div className="border border-gray-400 p-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[7pt]">
              <div className="font-bold border-b border-gray-300 pb-0.5">Account Title</div>
              <div className="font-bold border-b border-gray-300 pb-0.5 text-right">Amount</div>
              {rfp.journalEntry.map((entry) => (
                <>
                  <div className={entry.entryType === "debit" ? "pl-2" : "pl-2 italic"}>
                    {entry.accountTitle} ({entry.entryType})
                  </div>
                  <div className={`text-right font-mono ${entry.entryType === "debit" ? "" : "italic"}`}>
                    {formatCurrency(entry.amount)}
                  </div>
                </>
              ))}
            </div>
            <div className="border-t border-gray-400 mt-1 pt-1 flex justify-between text-[7pt] font-bold">
              <span>TOTAL</span>
              <span className="font-mono">{formatCurrency(totalDebits)}</span>
            </div>
          </div>
        ) : (
          <div className="border border-gray-400">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b border-gray-400">
                  <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 w-6">#</TableHead>
                  <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1">Account Title</TableHead>
                  <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-right w-20">Debit</TableHead>
                  <TableHead className="text-[6pt] font-bold text-black uppercase py-1 px-1 text-right w-20">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfp.journalEntry.map((entry, index) => (
                  <TableRow key={entry.id} className="border-b border-gray-200 last:border-b-0">
                    <TableCell className="py-0.5 px-1 text-center text-gray-700">{index + 1}</TableCell>
                    <TableCell className="py-0.5 px-1 text-[8pt] font-semibold">{entry.accountTitle}</TableCell>
                    <TableCell className="py-0.5 px-1 text-right font-mono text-[7pt]">
                      {entry.entryType === "debit" ? formatCurrency(entry.amount) : ""}
                    </TableCell>
                    <TableCell className="py-0.5 px-1 text-right font-mono text-[7pt]">
                      {entry.entryType === "credit" ? formatCurrency(entry.amount) : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-gray-100 border-t border-gray-400">
                  <TableCell colSpan={2} className="py-0.5 px-1 text-right font-bold text-[6pt] uppercase">
                    Total Distribution
                  </TableCell>
                  <TableCell className="py-0.5 px-1 text-right font-mono font-bold text-[7pt]">
                    {formatCurrency(totalDebits)}
                  </TableCell>
                  <TableCell className="py-0.5 px-1 text-right font-mono font-bold text-[7pt]">
                    {formatCurrency(totalCredits)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

      {/* AUTHORIZATION - Compact side-by-side */}
      <div className="mb-3">
        <p className="text-[7pt] font-bold text-black uppercase tracking-wider mb-1">
          Authorization
        </p>
        <div className="grid grid-cols-3 gap-3">
          {["Prepared By", "Reviewed By", "Approved By"].map((role) => (
            <div key={role} className="border-t border-gray-400 pt-1">
              <p className="text-[6pt] uppercase text-gray-600 font-semibold mb-3">{role}</p>
              <div className="h-6 border-b border-gray-400 mb-0.5"></div>
              <p className="text-[6pt] text-gray-500 text-center">Signature over Printed Name</p>
              <p className="text-[5pt] text-gray-400 text-center mt-0.5">Date: ___________</p>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS - Single line if space is tight, otherwise compact paragraph */}
      <div className="border-t border-gray-300 pt-2 mb-2">
        <p className="text-[6pt] text-gray-700 leading-tight">
          <span className="font-bold">Terms:</span> All expenses verified per company policy. Cash advances subject to 3-day liquidation. 
          Unliquidated amounts deducted from payroll. Finance approval required. Document alterations must be initialed.
        </p>
      </div>

      {/* CORPORATE FOOTER */}
      <div className="mt-auto pt-2 border-t-2 border-black">
        <div className="flex justify-between items-end text-[6pt] text-gray-600">
          <div>
            <p className="font-bold text-black text-[7pt]">{COMPANY_INFO.name}</p>
            <p>{COMPANY_INFO.city}</p>
          </div>
          <div className="text-center">
            <p className="italic">System-generated document</p>
          </div>
          <div className="text-right">
            <p>{today} | Page 1 of 1</p>
            <p className="font-mono text-[5pt]">RFP-{rfp.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};