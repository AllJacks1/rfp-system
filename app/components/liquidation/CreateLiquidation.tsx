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
  User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CreateLiquidationPageProps } from "@/lib/interfaces";
interface LiquidationEntry {
  id: string;
  date: string;
  plateNumber: string;
  supplier: string;
  description: string;
  glAccount: string;
  amount: number;
}

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

// ✅ Safe number parsing for string amounts from database
const parseAmount = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const cleaned = value.toString().replace(/[₱$,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (value: number | string | null | undefined): string => {
  const num = parseAmount(value);
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
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

export default function CreateLiquidation({ rfp }: CreateLiquidationPageProps) {
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
  const originalAmount = parseAmount(rfp?.total_payable);
  const remainingBalance = originalAmount - totalLiquidated;
  const isBalanced = remainingBalance === 0;
  const isOverLiquidated = remainingBalance < 0;

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
                No RFP request provided. Please select an approved RFP to liquidate.
              </p>
              <Link href="/home/finance/liquidation">
                <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Liquidation
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
                Liquidating {rfp.rfp_number} • {rfp.payable_to}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
          >
            {rfp.status === "approved" ? "Approved" : rfp.status}
          </Badge>
        </div>

        {/* RFP Summary Card - Updated to match actual data structure */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#2B3A9F]" />
              Original RFP Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Requested By */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Requested By
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center text-[10px] font-bold text-[#2B3A9F]">
                    {rfp.requested_by
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {rfp.requested_by}
                  </span>
                </div>
              </div>

              {/* Department */}
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

              {/* Original Amount */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Original Amount
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-mono font-semibold text-slate-900">
                    {formatCurrency(rfp.total_payable)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Payment Method
                </p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {rfp.payment_method}
                  </span>
                </div>
              </div>

              {/* Payable To */}
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Payable To
                </p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {rfp.payable_to}
                  </span>
                </div>
              </div>

              {/* Request Date */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Request Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {formatDate(rfp.request_date)}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-medium">
                  Due Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {formatDate(rfp.due_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Remaining Balance Alert */}
            <div className={`mt-4 p-3 rounded-lg border ${
              isBalanced 
                ? "bg-emerald-50 border-emerald-200" 
                : isOverLiquidated 
                  ? "bg-rose-50 border-rose-200" 
                  : "bg-amber-50 border-amber-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  isBalanced 
                    ? "text-emerald-700" 
                    : isOverLiquidated 
                      ? "text-rose-700" 
                      : "text-amber-700"
                }`}>
                  {isBalanced 
                    ? "✓ Fully Liquidated" 
                    : isOverLiquidated 
                      ? "⚠ Over Liquidated" 
                      : "⏳ Remaining to Liquidate"}
                </span>
                <span className={`font-mono font-bold ${
                  isBalanced 
                    ? "text-emerald-700" 
                    : isOverLiquidated 
                      ? "text-rose-700" 
                      : "text-amber-700"
                }`}>
                  {formatCurrency(Math.abs(remainingBalance))}
                </span>
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
                  max={remainingBalance > 0 ? remainingBalance : undefined}
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
                  parseFloat(amount) <= 0 ||
                  (remainingBalance > 0 && parseFloat(amount) > remainingBalance)
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
                    <span className="text-slate-500">Total Liquidated:</span>
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
                      <TableHead className="w-24 text-xs font-bold text-slate-700">
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
                      <TableHead className="w-10"></TableHead>
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
                              No entries yet. Fill the form above to add expenses.
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
                            {formatCurrency(originalAmount)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow
                          className={`${
                            isBalanced
                              ? "bg-emerald-50"
                              : isOverLiquidated
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
                                  : isOverLiquidated
                                    ? "text-rose-700"
                                    : "text-amber-700"
                              }
                            >
                              {isBalanced
                                ? "Balance"
                                : isOverLiquidated
                                  ? "Over Liquidated"
                                  : "Remaining Balance"}
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono text-sm font-bold ${
                              isBalanced
                                ? "text-emerald-700"
                                : isOverLiquidated
                                  ? "text-rose-700"
                                  : "text-amber-700"
                            }`}>
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
                disabled={entries.length === 0 || !isBalanced}
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