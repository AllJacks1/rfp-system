"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  MoreHorizontal,
  Plus,
  Search,
  Store,
  Trash2,
  Eye,
  Pencil,
  Phone,
  Mail,
  Star,
  X,
  User,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  paymentTerms: string;
  status: "active" | "inactive";
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "TechSupply Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@techsupply.com",
    phone: "+1 (555) 123-4567",
    category: "IT Equipment",
    rating: 5,
    paymentTerms: "Net 30",
    status: "active",
  },
  {
    id: "2",
    name: "Office Solutions Inc.",
    contactPerson: "Michael Chen",
    email: "mike@officesolutions.com",
    phone: "+1 (555) 987-6543",
    category: "Office Supplies",
    rating: 4,
    paymentTerms: "Net 15",
    status: "active",
  },
  {
    id: "3",
    name: "Global Logistics Ltd.",
    contactPerson: "Emma Wilson",
    email: "emma@globallog.com",
    phone: "+1 (555) 456-7890",
    category: "Logistics",
    rating: 5,
    paymentTerms: "Net 45",
    status: "active",
  },
  {
    id: "4",
    name: "Premium Services LLC",
    contactPerson: "David Brown",
    email: "david@premium.com",
    phone: "+1 (555) 234-5678",
    category: "Professional Services",
    rating: 3,
    paymentTerms: "Due on Receipt",
    status: "active",
  },
];

const supplierCategories = [
  "IT Equipment",
  "Office Supplies",
  "Logistics",
  "Professional Services",
  "Raw Materials",
  "Manufacturing",
  "Marketing",
  "Facilities",
  "Other",
];

const paymentTermsOptions = [
  "Due on Receipt",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Net 90",
];

interface SuppliersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SuppliersDialog({
  open,
  onOpenChange,
}: SuppliersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "",
    rating: 3,
    paymentTerms: "Net 30",
    status: "active",
  });

  const activeSuppliers = suppliers.filter((s) => s.status === "active");
  const filteredSuppliers = activeSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenForm = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        category: "",
        rating: 3,
        paymentTerms: "Net 30",
        status: "active",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      category: "",
      rating: 3,
      paymentTerms: "Net 30",
      status: "active",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSupplier) {
      // Update existing
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id ? { ...s, ...(formData as Supplier) } : s
        )
      );
    } else {
      // Create new
      const newSupplier: Supplier = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "",
        contactPerson: formData.contactPerson || "",
        email: formData.email || "",
        phone: formData.phone || "",
        category: formData.category || "Other",
        rating: formData.rating || 3,
        paymentTerms: formData.paymentTerms || "Net 30",
        status: "active",
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }

    handleCloseForm();
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    );
  };

  const renderRatingInput = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`w-6 h-6 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300 hover:text-amber-200"}`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-600 font-medium">
          {rating} / 5
        </span>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-violet-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-violet-600">
              <div className="p-2 rounded-lg bg-violet-50">
                <Store className="w-6 h-6 text-violet-600" />
              </div>
              Suppliers & Vendors
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage supplier and vendor records, including contacts and payment
              terms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                />
              </div>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </div>

            {/* Suppliers Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Supplier Directory
                      <Badge className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                        {activeSuppliers.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Active suppliers and vendor partners
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-violet-600 font-semibold">
                        Supplier
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Contact
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Rating
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Payment Terms
                      </TableHead>
                      <TableHead className="w-[100px] text-violet-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Store className="w-8 h-8 text-slate-300" />
                            <p>No suppliers found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow
                          key={supplier.id}
                          className="hover:bg-violet-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                                <Store className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {supplier.name}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {supplier.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-medium">
                                {supplier.contactPerson}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {supplier.phone}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-violet-300 text-violet-700"
                            >
                              {supplier.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{renderRating(supplier.rating)}</TableCell>
                          <TableCell className="text-slate-600 font-medium">
                            {supplier.paymentTerms}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-violet-100 hover:text-violet-600"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel className="text-xs text-slate-500">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-violet-50 hover:text-violet-600">
                                  <Eye className="w-4 h-4 mr-2 text-violet-600" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-slate-700 cursor-pointer hover:bg-violet-50 hover:text-violet-600"
                                  onClick={() => handleOpenForm(supplier)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-violet-600" />
                                  Edit Supplier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(supplier.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Supplier Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 border-t-4 border-t-violet-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-violet-600">
              <div className="p-2 rounded-lg bg-violet-50">
                {editingSupplier ? (
                  <Pencil className="w-5 h-5 text-violet-600" />
                ) : (
                  <Plus className="w-5 h-5 text-violet-600" />
                )}
              </div>
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingSupplier
                ? "Update the supplier details below."
                : "Fill in the details to register a new supplier or vendor."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., TechSupply Co."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-slate-700">
                Contact Person
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="contactPerson"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                  className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:border-violet-600 focus:ring-violet-600/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms" className="text-slate-700">
                  Payment Terms
                </Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, paymentTerms: value }))
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:border-violet-600 focus:ring-violet-600/20">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">Rating</Label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                {renderRatingInput(formData.rating || 3)}
              </div>
            </div>

            <DialogFooter className="gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                className="border-slate-200 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {editingSupplier ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Supplier
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}