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
  Upload,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function CreateServiceRequest() {
  const [items, setItems] = useState<
    Array<{
      id: number;
      name: string;
      description: string;
      unit: string;
      price: string;
      total: string;
    }>
  >([]);

  const [priority, setPriority] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  // Calculate estimated total
  const estimatedTotal = unitPrice * quantity;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High":
        return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
      case "Low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-100 mb-2"
            >
              New Request
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Service Request
            </h1>
            <p className="text-slate-500 mt-1">
              Create a new service request for processing and approval
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Request Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Request Information
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
                  placeholder="Enter a clear, descriptive title"
                  className="h-11 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20 bg-white"
                />
              </div>

              {/* Grid Layout for Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Service Category
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${category ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {category || "Select category"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "IT Services",
                        "Facilities",
                        "HR Support",
                        "Finance",
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
                  <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Priority Level
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${priority ? getPriorityColor(priority) : "text-slate-500"}`}
                      >
                        {priority || "Set priority"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        { label: "High", color: "text-rose-600" },
                        { label: "Medium", color: "text-amber-600" },
                        { label: "Low", color: "text-emerald-600" },
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
                            {p.label} Priority
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Company
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${company ? "text-slate-900" : "text-slate-500"}`}
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
                  <Label className="text-sm font-medium text-slate-900">
                    Department
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${department ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {department || "Select department"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "Operations",
                        "Administration",
                        "Development",
                        "Marketing",
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900">
                    Preferred Service Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      className="h-11 pl-10 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900">
                    Expected Completion
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      className="h-11 pl-10 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-900">
                  Description <span className="text-rose-500">*</span>
                </Label>
                <textarea
                  placeholder="Provide detailed information about your service request..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-y"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" />
                  Attachments
                </Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-200 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor & Payment Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Vendor & Payment Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900">
                    Preferred Vendor
                    <span className="text-slate-400 font-normal ml-1">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    placeholder="Vendor name"
                    className="h-11 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900">
                    Vendor Contact
                  </Label>
                  <Input
                    placeholder="Email or phone"
                    className="h-11 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900">
                    Required Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      className="h-11 pl-10 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    Payment Method
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${paymentMethod ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {paymentMethod || "Select method"}
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {[
                        "Cash",
                        "Cheque",
                        "GCash",
                        "Bank Transfer",
                        "Credit Card",
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

          {/* Materials/Labor Section */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Materials & Labor
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Add Item Form */}
              <div className="bg-slate-50/50 rounded-lg p-5 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                  <div className="space-y-2 lg:col-span-1">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Item Name
                    </Label>
                    <Input
                      placeholder="e.g., Labor Hours"
                      className="h-10 border-slate-200 focus:border-blue-600 bg-white"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-1">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Description
                    </Label>
                    <Input
                      placeholder="Brief details"
                      className="h-10 border-slate-200 focus:border-blue-600 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Unit
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-between h-10 border-slate-200 hover:bg-white ${unit ? "text-slate-900" : "text-slate-500"}`}
                        >
                          {unit || "Select"}
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["Piece", "ml", "kg", "Hour", "Day", "Project"].map(
                          (u) => (
                            <DropdownMenuItem
                              key={u}
                              className="cursor-pointer"
                              onClick={() => setUnit(u)}
                            >
                              {u}
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Est. Unit Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                        ₱
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={unitPrice || ""}
                        onChange={(e) =>
                          setUnitPrice(parseFloat(e.target.value) || 0)
                        }
                        className="h-10 pl-7 border-slate-200 focus:border-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      QTY
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={quantity || ""}
                      onChange={(e) =>
                        setQuantity(parseFloat(e.target.value) || 0)
                      }
                      className="h-10 border-slate-200 focus:border-blue-600 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Est. Total
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                        ₱
                      </span>
                      <Input
                        type="text"
                        readOnly
                        value={estimatedTotal.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        className="h-10 pl-7 border-slate-200 bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Line Items ({items.length})
                  </h4>
                  {items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear all
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-200">
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Item
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Unit
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
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Package className="w-8 h-8 text-slate-300" />
                            <p className="text-sm">No items added yet</p>
                            <p className="text-xs text-slate-400">
                              Add materials or labor above
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell className="font-medium text-slate-900">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {item.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-700 font-normal"
                            >
                              {item.unit}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-slate-600">
                            ₱{item.price}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-slate-900">
                            ₱{item.total}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="flex flex-col items-end gap-4 pt-4 border-t border-slate-100">
                <div className="w-full max-w-sm space-y-3">
                  <Separator className="bg-slate-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-900">
                      Total Estimated Cost
                    </span>
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      ₱0.00
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-none h-11 px-6 bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white shadow-lg shadow-slate-900/20 hover:shadow-[#2B3A9F]/80 transition-all">
              Submit Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
