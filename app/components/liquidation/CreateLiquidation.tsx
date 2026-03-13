"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Car,
  FileText,
  Plus,
  Save,
  Trash2,
  Building2,
  CreditCard,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

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

interface LiquidationEntry {
  id: string;
  date: string;
  plateNumber: string;
  supplier: string;
  description: string;
  glAccount: string;
  amount: number;
}

// Mock Data
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
];

// Mock dropdown data
const plateNumbers = ["ABC-123", "XYZ-789", "DEF-456", "GHI-321"];
const suppliers = ["Shell Station", "Petron", "Caltex", "Total", "Smart Fuel"];
const glAccounts = [
  "Fuel Expense",
  "Transportation Expense",
  "Maintenance Expense",
  "Toll Fees",
  "Parking Fees",
];

export default function CreateLiquidation() {
  const searchParams = useSearchParams();
  const rfpId = searchParams.get("rfpId");

  const rfp = useMemo(() => {
    return approvedRFPs.find((r) => r.id === rfpId);
  }, [rfpId]);

  // Form state
  const [date, setDate] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [glAccount, setGlAccount] = useState("");
  const [amount, setAmount] = useState("");

  // Entries state
  const [entries, setEntries] = useState<LiquidationEntry[]>([]);

  const handleAddEntry = () => {
    if (!date || !amount || !plateNumber || !supplier || !glAccount) return;

    const newEntry: LiquidationEntry = {
      id: `ENTRY-${Date.now()}`,
      date,
      plateNumber,
      supplier,
      description: description || "-",
      glAccount,
      amount: parseFloat(amount),
    };

    setEntries([...entries, newEntry]);

    // Reset form
    setDate("");
    setPlateNumber("");
    setSupplier("");
    setDescription("");
    setGlAccount("");
    setAmount("");
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const totalLiquidated = entries.reduce((sum, e) => sum + e.amount, 0);
  const remainingBalance = (rfp?.totalPayable || 0) - totalLiquidated;
  const isBalanced = remainingBalance === 0;

  if (!rfp) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-dashed border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-[#2B3A9F]/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-[#2B3A9F]" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Request Not Found
              </h2>
              <p className="text-slate-500 text-center max-w-md mb-6">
                {rfpId
                  ? `No request found with ID: ${rfpId}`
                  : "No request ID provided"}
              </p>
              <Link href="/home/finance/liquidation">
                <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Requests
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/home/finance/liquidation">
              <Button
                variant="outline"
                size="icon"
                className="border-slate-300 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4 text-slate-700" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Liquidation
              </h1>
              <p className="text-sm text-slate-500">
                Liquidating {rfp.id} • {rfp.rfpTitle}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 font-semibold"
          >
            {rfp.paymentType}
          </Badge>
        </div>

        {/* RFP Summary Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#2B3A9F]" />
              Original Request Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Requestor
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center text-[10px] font-bold text-[#2B3A9F]">
                    {rfp.requestor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {rfp.requestor}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Department
                </p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {rfp.department}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Original Amount
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-mono font-semibold text-slate-900">
                    {formatCurrency(rfp.totalPayable)}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Remaining
                </p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span
                    className={`text-sm font-mono font-semibold ${
                      remainingBalance < 0
                        ? "text-rose-600"
                        : remainingBalance === 0
                          ? "text-emerald-600"
                          : "text-amber-600"
                    }`}
                  >
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entry Form */}
        <Card className="border-l-4 border-l-[#2B3A9F] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#2B3A9F]/10 rounded-lg">
                <Plus className="h-5 w-5 text-[#2B3A9F]" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900">
                  Add Liquidation Entry
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Record expenses against this request
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Date
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Car className="h-3.5 w-3.5 text-slate-400" />
                  Plate Number
                </Label>
                <Select value={plateNumber} onValueChange={setPlateNumber}>
                  <SelectTrigger className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]">
                    <SelectValue placeholder="Select plate" />
                  </SelectTrigger>
                  <SelectContent>
                    {plateNumbers.map((plate) => (
                      <SelectItem key={plate} value={plate}>
                        {plate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  Supplier
                </Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((sup) => (
                      <SelectItem key={sup} value={sup}>
                        {sup}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Description
                </Label>
                <Input
                  placeholder="e.g., Fuel for client meeting"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  GL Account
                </Label>
                <Select value={glAccount} onValueChange={setGlAccount}>
                  <SelectTrigger className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {glAccounts.map((acc) => (
                      <SelectItem key={acc} value={acc}>
                        {acc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  Amount
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-slate-300 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleAddEntry}
                disabled={
                  !date ||
                  !plateNumber ||
                  !supplier ||
                  !glAccount ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Entries Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Liquidation Entries ({entries.length})
                </Label>
                {entries.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-mono font-semibold text-[#2B3A9F]">
                      {formatCurrency(totalLiquidated)}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-25 text-xs font-bold text-slate-700">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Plate No.
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Supplier
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        GL Account
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-slate-700">
                        Amount
                      </TableHead>
                      <TableHead className="w-12.5"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 text-slate-300" />
                            <p className="text-sm">
                              No entries yet. Fill the form above to add
                              expenses.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className="group hover:bg-slate-50/50"
                        >
                          <TableCell className="text-sm text-slate-700">
                            {entry.date}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-slate-900">
                            {entry.plateNumber}
                          </TableCell>
                          <TableCell className="text-sm text-slate-700">
                            {entry.supplier}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {entry.description}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {entry.glAccount}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-semibold text-slate-900">
                            {formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {entries.length > 0 && (
                      <>
                        <TableRow className="bg-slate-50 font-semibold border-t-2">
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm text-slate-700"
                          >
                            Total Liquidated
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-bold text-[#2B3A9F]">
                            {formatCurrency(totalLiquidated)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow className="bg-slate-50/50">
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm text-slate-700"
                          >
                            Original RFP Amount
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-slate-900">
                            {formatCurrency(rfp.totalPayable)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow
                          className={`${
                            isBalanced
                              ? "bg-emerald-50"
                              : remainingBalance < 0
                                ? "bg-rose-50"
                                : "bg-amber-50"
                          }`}
                        >
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm font-bold"
                          >
                            <span
                              className={
                                isBalanced
                                  ? "text-emerald-700"
                                  : remainingBalance < 0
                                    ? "text-rose-700"
                                    : "text-amber-700"
                              }
                            >
                              {isBalanced
                                ? "Balance"
                                : remainingBalance < 0
                                  ? "Over Liquidated"
                                  : "Remaining Balance"}
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono text-sm font-bold ${
                              isBalanced
                                ? "text-emerald-700"
                                : remainingBalance < 0
                                  ? "text-rose-700"
                                  : "text-amber-700"
                            }`}
                          >
                            {formatCurrency(Math.abs(remainingBalance))}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setEntries([])}
                disabled={entries.length === 0}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Clear All
              </Button>
              <Button
                disabled={entries.length === 0}
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/20"
              >
                <Save className="h-4 w-4 mr-2" />
                Submit Liquidation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Utility
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
}
