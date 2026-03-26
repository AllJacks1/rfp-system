"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreateRequestForPaymentPageProps,
  Item,
  statusConfig,
} from "@/lib/interfaces";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Package,
  Phone,
  Plus,
  Printer,
  Save,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

// Types
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
  paymentType: string;
  description: string;
}

interface LineItem {
  id: string;
  particulars: string;
  qty: string;
  price: string;
  totalAmount: string;
  chargeTo: string;
}

const companies = [
  { value: "technova", label: "TechNova Solutions" },
  { value: "astrasolutions", label: "Astra Solutions" },
  { value: "primeproperties", label: "Prime Properties LLC" },
  { value: "microsoft", label: "Microsoft Corporation" },
  { value: "aws", label: "Amazon Web Services" },
];

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

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export default function CreateRequestForPayment({
  order,
}: CreateRequestForPaymentPageProps) {
  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [particulars, setParticulars] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [chargeTo, setChargeTo] = useState("");

  // Additional Fields
  const [dueDate, setDueDate] = useState("");
  const [vendorContact, setVendorContact] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${order?.order_number || "Details"}`,
    pageStyle: `
      @media print {
        @page { size: A4; margin: 10mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-content { padding: 0 !important; }
      }
    `,
  });

  const totalLineItems = useMemo(
    () =>
      lineItems.reduce(
        (sum, item) => sum + (parseFloat(item.totalAmount) || 0),
        0,
      ),
    [lineItems],
  );

  const handleAddLineItem = () => {
    if (!particulars || !qty || !price) return;
    const total = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      particulars,
      qty,
      price,
      totalAmount: total.toString(),
      chargeTo,
    };
    setLineItems([...lineItems, newItem]);
    setParticulars("");
    setQty("");
    setPrice("");
    setChargeTo("");
  };

  const handleDeleteLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Auto-calculate total when qty or price changes
  const calculatedTotal = useMemo(() => {
    const q = parseFloat(qty) || 0;
    const p = parseFloat(price) || 0;
    return (q * p).toFixed(2);
  }, [qty, price]);

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  };

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              No order found.
            </p>
            <Link href="/home/finance/request-for-payment">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/home/finance/request-for-payment">
            <Button variant="outline" size="icon" aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground">Viewing {order.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{order.title}</CardTitle>
                  <CardDescription className="text-base">
                    {order.description}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={statusConfig[order.status].color}
                >
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {statusConfig[order.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Request Type"
                  value={order.service_category}
                  icon={Package}
                />
                <DetailItem
                  label="Department"
                  value={order.department}
                  icon={Building2}
                />
                {/* <DetailItem
                  label="Date Approved"
                  value={new Date(order.approved_on).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                  icon={Calendar}
                /> */}
                <DetailItem
                  label="Ordered By"
                  value={order.requested_by}
                  icon={User}
                />
                <DetailItem
                  label="Payable To"
                  value={order.preferred_vendor}
                  icon={User}
                />
                <DetailItem
                  label="Total Payable"
                  value={calculateTotal(order.items).toString()}
                  icon={Banknote}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Additional Information
                  </CardTitle>
                  <CardDescription>
                    Payment details and vendor contact
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Due Date
                  </Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Vendor Contact Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+63 XXX-XXX-XXXX"
                    value={vendorContact}
                    onChange={(e) => setVendorContact(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Line Items</CardTitle>
                  <CardDescription>
                    Add particulars, quantities, and pricing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg border">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">Particulars</Label>
                  <Input
                    placeholder="Item description..."
                    value={particulars}
                    onChange={(e) => setParticulars(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Qty</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Total</Label>
                  <Input
                    type="text"
                    value={calculatedTotal}
                    disabled
                    className="bg-slate-100 font-mono"
                  />
                </div>
                <div className="md:col-span-4 space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Charge To (Company)
                  </Label>
                  <Select value={chargeTo} onValueChange={setChargeTo}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select company..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.value} value={company.value}>
                          {company.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddLineItem}
                    disabled={!particulars || !qty || !price}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 hover:bg-slate-100">
                      <TableHead className="w-12 text-center font-bold text-slate-700">
                        #
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Particulars
                      </TableHead>
                      <TableHead className="w-20 text-center font-bold text-slate-700">
                        Qty
                      </TableHead>
                      <TableHead className="w-28 text-right font-bold text-slate-700">
                        Price
                      </TableHead>
                      <TableHead className="w-28 text-right font-bold text-slate-700">
                        Total
                      </TableHead>
                      <TableHead className="text-right font-bold text-slate-700">
                        Charge To
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                            <p>
                              No line items yet. Fill the form above and click
                              &quot;Add&quot;.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      lineItems.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className="group hover:bg-slate-50/50"
                        >
                          <TableCell className="text-center text-muted-foreground font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.particulars}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatCurrency(item.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {companies.find((c) => c.value === item.chargeTo)
                              ?.label || item.chargeTo}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLineItem(item.id)}
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {lineItems.length > 0 && (
                      <TableRow className="bg-slate-50 font-bold border-t-2">
                        <TableCell
                          colSpan={5}
                          className="text-right text-slate-700"
                        >
                          TOTAL
                        </TableCell>
                        <TableCell className="text-right font-mono text-lg text-slate-900">
                          {formatCurrency(totalLineItems)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary/Actions */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
              <CardDescription>Request for Payment Summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PO Total Payable - From original order */}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-slate-700">
                  Total Payable
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(calculateTotal(order.items))}
                </span>
              </div>

              {/* Line Items Subtotal - Calculated from entries */}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  Line Items Subtotal
                </span>
                <span className="font-mono font-semibold">
                  {formatCurrency(totalLineItems)}
                </span>
              </div>

              {/* Difference - Conditional styling */}
              {(() => {
                const poTotal = Number(
                  formatCurrency(calculateTotal(order.items)) || 0,
                );
                const difference = poTotal - totalLineItems;
                const isMatched = Math.abs(difference) < 0.01;
                const isOver = difference < 0;

                return (
                  <div
                    className={`flex justify-between items-center py-3 px-3 rounded-lg border ${
                      isMatched
                        ? "bg-green-50 border-green-200"
                        : isOver
                          ? "bg-red-50 border-red-200"
                          : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isMatched
                            ? "text-green-800"
                            : isOver
                              ? "text-red-800"
                              : "text-amber-800"
                        }`}
                      >
                        {isMatched ? "Matched" : isOver ? "Over" : "Remaining"}
                      </span>
                      {!isMatched && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            isOver
                              ? "border-red-300 text-red-700"
                              : "border-amber-300 text-amber-700"
                          }`}
                        >
                          {isOver ? "Excess" : "Short"}
                        </Badge>
                      )}
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        isMatched
                          ? "text-green-700"
                          : isOver
                            ? "text-red-700"
                            : "text-amber-700"
                      }`}
                    >
                      {isMatched
                        ? "$0.00"
                        : formatCurrency(Math.abs(difference))}
                    </span>
                  </div>
                );
              })()}

              {/* Final Total */}
              <div className="flex justify-between items-center py-3 border-t-2 border-slate-200">
                <span className="font-semibold text-slate-900">
                  Final Total
                </span>
                <span className="font-mono font-bold text-lg text-primary">
                  {formatCurrency(totalLineItems)}
                </span>
              </div>

              {/* Alert message when not matched */}
              {(() => {
                const poTotal = Number(
                  formatCurrency(calculateTotal(order.items)) || 0,
                );
                const difference = poTotal - totalLineItems;
                const isMatched = Math.abs(difference) < 0.01;

                if (!isMatched && lineItems.length > 0) {
                  return (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        difference < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {difference < 0
                        ? `Line items exceed PO amount by ${formatCurrency(Math.abs(difference))}`
                        : `Remaining balance of ${formatCurrency(Math.abs(difference))} will need to be allocated`}
                    </div>
                  );
                }
                return null;
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setLineItems([])}
                className="w-full"
              >
                Clear All Items
              </Button>
              <Button
                disabled={lineItems.length === 0}
                className="w-full bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
