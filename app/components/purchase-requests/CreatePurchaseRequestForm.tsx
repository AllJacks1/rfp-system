"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Plus,
  Trash2,
  X,
  FileText,
  Calendar,
  Building2,
  Briefcase,
  CreditCard,
  Package,
  User,
  ArrowRight,
  ShoppingCart,
  Hash,
  Calculator,
  Car,
  ArrowLeft,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

interface LineItem {
  id: number;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function CreatePurchaseRequestForm() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [priority, setPriority] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Form state for new item
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    unit: "",
    quantity: 0,
    unitPrice: 0,
  });

  // Calculate item total
  const itemTotal = useMemo(() => {
    return (newItem.quantity || 0) * (newItem.unitPrice || 0);
  }, [newItem.quantity, newItem.unitPrice]);

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.unit || newItem.quantity <= 0) return;

    const item: LineItem = {
      id: Date.now(),
      name: newItem.name,
      description: newItem.description,
      unit: newItem.unit,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      total: newItem.quantity * newItem.unitPrice,
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
    });
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearForm = () => {
    setNewItem({
      name: "",
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
    });
  };

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case "High":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
          button: "border-rose-200 text-rose-700 bg-rose-50/50",
        };
      case "Medium":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          button: "border-amber-200 text-amber-700 bg-amber-50/50",
        };
      case "Low":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          button: "border-emerald-200 text-emerald-700 bg-emerald-50/50",
        };
      default:
        return { badge: "", dot: "", button: "text-slate-500" };
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
          <div className="flex items-center gap-3">
            <Link href="/home/finance/service-requests">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 text-[#2B3A9F] border-indigo-200 font-medium"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  New Purchase Request
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create Purchase Request
              </h1>
              <p className="text-sm text-slate-500">
                Submit a new purchase request for review and approval
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Request Information Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-md">
                  <FileText className="w-4 h-4 text-[#2B3A9F]" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Request Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-900">
                  Request Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Q4 Office Supplies Procurement"
                  className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white"
                />
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Request Type
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${category ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {category || "Select type"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "Office Supplies",
                        "IT Equipment",
                        "Services",
                        "Raw Materials",
                        "Others",
                      ].map((cat) => (
                        <DropdownMenuItem
                          key={cat}
                          className="cursor-pointer"
                          onClick={() => setCategory(cat)}
                        >
                          {cat}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityStyles(priority).dot}`}
                    />
                    Priority
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 transition-colors ${priority ? getPriorityStyles(priority).button : "text-slate-500"}`}
                      >
                        {priority || "Select priority"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        {
                          label: "High",
                          color: "text-rose-600",
                          bg: "bg-rose-50",
                        },
                        {
                          label: "Medium",
                          color: "text-amber-600",
                          bg: "bg-amber-50",
                        },
                        {
                          label: "Low",
                          color: "text-emerald-600",
                          bg: "bg-emerald-50",
                        },
                      ].map((p) => (
                        <DropdownMenuItem
                          key={p.label}
                          className={`cursor-pointer ${p.color}`}
                          onClick={() => setPriority(p.label)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${p.color.replace("text-", "bg-")}`}
                            />
                            {p.label}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Company
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${company ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {company || "Select company"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {["Ihub", "Astra", "Jmave", "Nexus"].map((comp) => (
                        <DropdownMenuItem
                          key={comp}
                          className="cursor-pointer"
                          onClick={() => setCompany(comp)}
                        >
                          {comp}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Department
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${department ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {department || "Select dept"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "Operations",
                        "Administration",
                        "Development",
                        "Marketing",
                        "Finance",
                      ].map((dept) => (
                        <DropdownMenuItem
                          key={dept}
                          className="cursor-pointer"
                          onClick={() => setDepartment(dept)}
                        >
                          {dept}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-900">
                  Description <span className="text-rose-500">*</span>
                </Label>
                <textarea
                  placeholder="Provide detailed information about the items or services needed, including specifications, purpose, and any other relevant details..."
                  className="w-full min-h-25 px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y transition-all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Asset Vehicles */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-md">
                  <Car className="w-4 h-4 text-[#2B3A9F]" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Asset Vehicle
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Plate Number
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${paymentMethod ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {plateNumber || "Select plate number"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "NAA 1234",
                        "CAB 5678",
                        "FAG 9012",
                        "LDT 3456",
                        "NHV 7890",
                      ].map((number) => (
                        <DropdownMenuItem
                          key={number}
                          className="cursor-pointer"
                          onClick={() => setPlateNumber(number)}
                        >
                          {number}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Car Type
                  </Label>
                  <Input
                    placeholder="Partner's car type"
                    className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Owner&rsquo;s first name
                  </Label>
                  <Input
                    placeholder="Car owner's first name"
                    className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Owner&rsquo;s last name
                  </Label>
                  <Input
                    placeholder="Car owner's last name"
                    className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor & Payment Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-md">
                  <User className="w-4 h-4 text-[#2B3A9F]" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Vendor Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Preferred Vendor
                    <span className="text-slate-400 font-normal ml-1">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    placeholder="Vendor company name"
                    className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Contact Person
                  </Label>
                  <Input
                    placeholder="Name or contact info"
                    className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Required Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      className="h-11 pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    Payment Terms
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${paymentMethod ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {paymentMethod || "Select terms"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "Cash",
                        "Check",
                        "Bank Transfer",
                        "Credit Card",
                        "Net 30",
                        "Net 60",
                      ].map((method) => (
                        <DropdownMenuItem
                          key={method}
                          className="cursor-pointer"
                          onClick={() => setPaymentMethod(method)}
                        >
                          {method}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-md">
                    <Package className="w-4 h-4 text-[#2B3A9F]" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Items in Particular
                  </CardTitle>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Add Item Form */}
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/60">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
                  <div className="space-y-2 lg:col-span-3">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Item Name
                    </Label>
                    <Input
                      placeholder="e.g., A4 Paper Ream"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="h-10 border-slate-200 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-3">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Description / Specs
                    </Label>
                    <Input
                      placeholder="Brand, model, specifications..."
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="h-10 border-slate-200 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Unit
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-between h-10 border-slate-200 hover:bg-white ${newItem.unit ? "text-slate-900" : "text-slate-500"}`}
                        >
                          {newItem.unit || "Select"}
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[
                          "Piece",
                          "Box",
                          "Pack",
                          "Ream",
                          "kg",
                          "Liter",
                          "Hour",
                          "Day",
                        ].map((u) => (
                          <DropdownMenuItem
                            key={u}
                            className="cursor-pointer"
                            onClick={() => setNewItem({ ...newItem, unit: u })}
                          >
                            {u}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Qty
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={newItem.quantity || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-10 pl-9 border-slate-200 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Unit Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                        ₱
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newItem.unitPrice || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-10 pl-7 border-slate-200 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Line Total:{" "}
                      <span className="font-semibold text-slate-900 font-mono">
                        {formatCurrency(itemTotal)}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearForm}
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddItem}
                      disabled={
                        !newItem.name || !newItem.unit || newItem.quantity <= 0
                      }
                      className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-200">
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">
                        #
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Item
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">
                        Qty
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">
                        Unit Price
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">
                        Total
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-600">
                                No items added
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Add items using the form above
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className="group border-slate-100"
                        >
                          <TableCell className="text-sm text-slate-500 font-mono">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-slate-600 hidden md:table-cell max-w-xs truncate">
                            {item.description || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-700 font-mono font-medium"
                            >
                              {item.quantity} {item.unit}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-slate-600">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-slate-900">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              {items.length > 0 && (
                <div className="flex flex-col items-end gap-3 pt-4 border-t border-slate-100">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-mono text-slate-900">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                    <Separator className="bg-slate-200" />
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base font-semibold text-slate-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-indigo-600 font-mono">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6">
          <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              disabled={items.length === 0}
              className="flex-1 sm:flex-none h-11 px-6 bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
