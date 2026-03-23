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
  Plus,
  ArrowLeftRight,
  Trash2,
  Save,
  Coins,
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
import { PrintServiceOrder } from "./PrintServiceOrderPage";
import { Request } from "@/lib/interfaces";

export interface Item {
  name: string;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
}

export interface Vehicle {
  vehicle_id: string;
  plate_number: string;
  car_type: string;
  owners_first_name: string;
  owners_last_name: string;
}

interface JournalEntry {
  id: number;
  accountTitle: string;
  amount: number;
  entryType: "debit" | "credit";
}

interface RequestDetailsPageProps {
  request: Request;
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
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

const priorityConfig: Record<string, string> = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
};

// Helper to calculate total from items
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
};

// Helper to format currency
const formatCurrency = (value: string | number | undefined | null): string => {
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

export default function RequestDetailsPage({
  request,
}: RequestDetailsPageProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accountTitle, setAccountTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [entryType, setEntryType] = useState<"debit" | "credit">("debit");

  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  // react-to-print setup
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Request_${request?.request_number || "Details"}`,
    pageStyle: `
      @media print {
        @page { size: A4; margin: 10mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-content { padding: 0 !important; }
      }
    `,
  });

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

  // Calculate total amount from items
  const totalAmount = useMemo(
    () => calculateTotal(request.items),
    [request.items],
  );

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              No request found
            </p>
            <Link href="/home/finance/service-orders">
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

  const StatusIcon = statusConfig[request.status]?.icon || AlertCircle;
  const isVehicleRequest = request.service_category === "Vehicle Maintenance";

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Actions - Hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/home/finance/service-orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Request Details</h1>
            <p className="text-sm text-muted-foreground">
              Viewing {request.request_number}
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
          <PrintServiceOrder
            request={request}
            formatCurrency={formatCurrency}
            serviceOrderNumber={requestId || request.request_number || "N/A"}
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
                    className={
                      statusConfig[request.status]?.color || "bg-slate-100"
                    }
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[request.status]?.label || request.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      priorityConfig[request.priority_level] || "bg-slate-100"
                    }
                  >
                    {request.priority_level} Priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Service Category"
                  value={request.service_category}
                  icon={Package}
                />
                <DetailItem
                  label="Department"
                  value={request.department}
                  icon={Building2}
                />
                <DetailItem
                  label="Preferred Date"
                  value={new Date(request.preferred_date).toLocaleDateString(
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
                  value={new Date(request.required_by).toLocaleDateString(
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
          {isVehicleRequest && request.vehicle?.plate_number && (
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
                    value={request.vehicle.plate_number}
                  />
                  <DetailItem
                    label="Vehicle Type"
                    value={request.vehicle.car_type}
                  />
                  <DetailItem
                    label="Owner Name"
                    value={`${request.vehicle.owners_first_name} ${request.vehicle.owners_last_name}`.trim()}
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
                      const price = parseFloat(item.unitPrice) || 0;
                      const total = qty * price;
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
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
                <div className="bg-muted/50 rounded-lg p-4 min-w-50">
                  <div className="flex justify-between items-center">
                    <span className="mr-2 text-sm text-muted-foreground">
                      Total Estimated Cost:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {request.supporting_documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.supporting_documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                      onClick={() =>
                        window.open(file, "_blank", "noopener,noreferrer")
                      }
                    >
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.split("/").pop() || file}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click to view
                        </p>
                      </div>
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
              <CardTitle className="text-base">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {request.requested_by?.slice(0, 2).toUpperCase() || "RQ"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{request.requested_by}</p>
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
                value={request.preferred_vendor}
                icon={Building2}
              />
              <DetailItem
                label="Contact Person"
                value={request.contact_person}
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
                value={request.payment_method}
                icon={CreditCard}
              />
              <DetailItem
                label="Amount"
                value={formatCurrency(totalAmount)}
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
                    className={`rounded-lg p-4 min-w-70 space-y-2 border ${isBalanced ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
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
