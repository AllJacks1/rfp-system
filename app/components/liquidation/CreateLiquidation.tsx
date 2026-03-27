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
import { SearchableCombobox } from "../inputs/SearchableCombobox";
import { createClient } from "@/lib/supabase/client";
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

export default function CreateLiquidation({
  rfp,
  vehicles,
  accounts,
  vendors,
}: CreateLiquidationPageProps) {
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
    if (!date || !amount || !supplier || !glAccount) return;

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

  const selectedPlateNumber = vehicles?.find(
    (p) => p.vehicle_id === plateNumber,
  );

  const totalLiquidated = entries.reduce((sum, e) => sum + e.amount, 0);
  const originalAmount = parseAmount(rfp?.total_payable);
  const remainingBalance = originalAmount - totalLiquidated;
  const isBalanced = remainingBalance === 0;
  const isOverLiquidated = remainingBalance < 0;

  const handleLiquidate = async () => {
    const supabase = createClient();
    if (entries.length === 0) return;

    try {
      // Convert entries into JSON snapshot
      const liquidationEntries = entries.map((entry) => {
        const vehicle = vehicles?.find(
          (v) => v.vehicle_id === entry.plateNumber,
        );

        return {
          date: entry.date,
          plate_number: vehicle?.plate_number || entry.plateNumber || null,
          car_type: vehicle?.car_type || null,
          owners_first_name: vehicle?.owners_first_name || null,
          owners_last_name: vehicle?.owners_last_name || null,

          supplier: entry.supplier,
          description: entry.description,
          gl_account: entry.glAccount,
          amount: entry.amount,
        };
      });

      const { error } = await supabase.from("liquidations").insert({
        rfp_id: rfp.id,
        rfp_number: rfp.rfp_number,

        requested_by: rfp.requested_by,
        department: rfp.department,
        payable_to: rfp.payable_to,
        payment_method: rfp.payment_method,

        original_amount: originalAmount,
        total_liquidated: totalLiquidated,
        remaining_balance: remainingBalance,

        liquidation_entries: liquidationEntries, // JSONB

        status: "liquidated",
      });

      if (error) throw error;

      // Update RFP status
      const { error: rfpError } = await supabase
        .from("requests_for_payment")
        .update({ status: "liquidated" })
        .eq("id", rfp.id);

      if (rfpError) throw rfpError;

      //router.push("/home/finance/liquidation");
    } catch (error) {
      console.error("Liquidation failed:", error);
    }
  };

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
                No RFP request provided. Please select an approved RFP to
                liquidate.
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
            <div
              className={`mt-4 p-3 rounded-lg border ${
                isBalanced
                  ? "bg-emerald-50 border-emerald-200"
                  : isOverLiquidated
                    ? "bg-rose-50 border-rose-200"
                    : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    isBalanced
                      ? "text-emerald-700"
                      : isOverLiquidated
                        ? "text-rose-700"
                        : "text-amber-700"
                  }`}
                >
                  {isBalanced
                    ? "✓ Fully Liquidated"
                    : isOverLiquidated
                      ? "⚠ Over Liquidated"
                      : "⏳ Remaining to Liquidate"}
                </span>
                <span
                  className={`font-mono font-bold ${
                    isBalanced
                      ? "text-emerald-700"
                      : isOverLiquidated
                        ? "text-rose-700"
                        : "text-amber-700"
                  }`}
                >
                  {formatCurrency(Math.abs(remainingBalance))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entry Form */}
        <Card className="border-l-4 border-l-[#2B3A9F] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#2B3A9F]/10 rounded-lg">
                <Plus className="h-5 w-5 text-[#2B3A9F]" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Add Liquidation Entry
                </CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Record expenses against this request
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input Form Section */}
            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-5">
              {/* Primary Fields - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white border-slate-300 focus:border-[#2B3A9F] focus:ring-2 focus:ring-[#2B3A9F]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    Supplier
                  </Label>
                  <SearchableCombobox
                    value={supplier}
                    onSelect={(value, item) => setSupplier(value)}
                    options={vendors.map((v) => ({
                      id: v.vendor_id,
                      name: v.name,
                    }))}
                    placeholder="Select supplier"
                    searchPlaceholder="Search suppliers..."
                    emptyMessage="No suppliers found."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Description
                  </Label>
                  <Input
                    placeholder="e.g., Fuel for client meeting"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white border-slate-300 focus:border-[#2B3A9F] focus:ring-2 focus:ring-[#2B3A9F]/20"
                  />
                </div>
              </div>

              {/* Secondary Fields - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-slate-400" />
                    GL Account
                  </Label>
                  <SearchableCombobox
                    value={glAccount}
                    onSelect={(value, item) => setGlAccount(value)}
                    options={accounts.map((acc) => ({
                      id: acc.account_id,
                      name: acc.name,
                    }))}
                    placeholder="Select account"
                    searchPlaceholder="Search accounts..."
                    emptyMessage="No accounts found."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    Amount
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={remainingBalance > 0 ? remainingBalance : undefined}
                    className="bg-white border-slate-300 focus:border-[#2B3A9F] focus:ring-2 focus:ring-[#2B3A9F]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Car className="h-4 w-4 text-slate-400" />
                    Plate Number{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </Label>
                  <SearchableCombobox
                    value={plateNumber}
                    onSelect={(value, item) => setPlateNumber(value)}
                    options={vehicles.map((v) => ({
                      id: v.vehicle_id,
                      name: v.plate_number,
                      subtitle: v.car_type,
                    }))}
                    placeholder="Select plate"
                    searchPlaceholder="Search plate numbers..."
                    emptyMessage="No vehicles found."
                    optional
                    optionalLabel="No vehicle"
                  />
                </div>
              </div>

              {/* Vehicle Details - Auto-populated */}
              {selectedPlateNumber && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600">
                      Car Type
                    </Label>
                    <div className="h-10 px-3 rounded-md border border-slate-200 bg-slate-100 text-slate-700 text-sm flex items-center">
                      {selectedPlateNumber.car_type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600">
                      Owner&apos;s First Name
                    </Label>
                    <div className="h-10 px-3 rounded-md border border-slate-200 bg-slate-100 text-slate-700 text-sm flex items-center">
                      {selectedPlateNumber.owners_first_name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600">
                      Owner&apos;s Last Name
                    </Label>
                    <div className="h-10 px-3 rounded-md border border-slate-200 bg-slate-100 text-slate-700 text-sm flex items-center">
                      {selectedPlateNumber.owners_last_name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add Entry Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleAddEntry}
                disabled={
                  !date ||
                  !supplier ||
                  !glAccount ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  (remainingBalance > 0 &&
                    parseFloat(amount) > remainingBalance)
                }
                className="bg-[#2B3A9F] hover:bg-[#1e2a7a] text-white shadow-md shadow-[#2B3A9F]/20 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            <Separator className="bg-slate-200" />

            {/* Entries Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-slate-800">
                    Liquidation Entries
                  </Label>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 font-medium"
                  >
                    {entries.length}
                  </Badge>
                </div>
                {entries.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Total Liquidated:</span>
                    <span className="font-mono font-semibold text-[#2B3A9F] text-base">
                      {formatCurrency(totalLiquidated)}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                      <TableHead className="w-28 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Plate No.
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Supplier
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        GL Account
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Amount
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-slate-50 rounded-full">
                              <AlertCircle className="h-6 w-6 text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-500">
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
                          className="group hover:bg-slate-50/80 border-b border-slate-100 last:border-0"
                        >
                          <TableCell className="text-sm text-slate-700 font-medium">
                            {entry.date}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-slate-900">
                            {entry.plateNumber || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-slate-700">
                            {entry.supplier}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {entry.description || "—"}
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
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {entries.length > 0 && (
                      <>
                        <TableRow className="bg-slate-50/90 border-t-2 border-slate-200">
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm font-semibold text-slate-700 py-3"
                          >
                            Total Liquidated
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-bold text-[#2B3A9F] py-3">
                            {formatCurrency(totalLiquidated)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow className="bg-slate-50/50">
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm text-slate-600 py-3"
                          >
                            Original RFP Amount
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-slate-900 py-3">
                            {formatCurrency(originalAmount)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow
                          className={`border-t-2 ${
                            isBalanced
                              ? "bg-emerald-50/80 border-emerald-200"
                              : isOverLiquidated
                                ? "bg-rose-50/80 border-rose-200"
                                : "bg-amber-50/80 border-amber-200"
                          }`}
                        >
                          <TableCell
                            colSpan={5}
                            className="text-right text-sm font-bold py-3"
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
                            className={`text-right font-mono text-sm font-bold py-3 ${
                              isBalanced
                                ? "text-emerald-700"
                                : isOverLiquidated
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

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setEntries([])}
                disabled={entries.length === 0}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Clear All
              </Button>
              <Button
                onClick={handleLiquidate}
                disabled={entries.length === 0 || !isBalanced}
                className="bg-[#2B3A9F] hover:bg-[#1e2a7a] text-white shadow-md shadow-[#2B3A9F]/20 transition-all disabled:opacity-50"
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
