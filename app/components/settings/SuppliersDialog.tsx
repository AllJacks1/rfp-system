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
  MoreHorizontal,
  Plus,
  Search,
  Store,
  Trash2,
  Pencil,
  Calendar,
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
import React, { useState, useEffect } from "react";
import { SuppliersDialogProps, Vendor } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

export default function SuppliersDialog({
  open,
  onOpenChange,
  vendors: initialVendors = [],
  onVendorsChange,
}: SuppliersDialogProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Sync with external vendors prop
  useEffect(() => {
    setVendors(initialVendors);
  }, [initialVendors]);

  // Form state
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: "",
    contact_person: "",
    payment_terms: "",
  });

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contact_person ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      v.vendor_id.includes(searchQuery),
  );

  const updateVendors = (newVendors: Vendor[]) => {
    setVendors(newVendors);
    onVendorsChange?.(newVendors);
  };

  const handleRemove = async (vendor_id: string) => {
    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("vendor_id", vendor_id);

    if (error) {
      console.error("Error deleting vendor:", error);
      return;
    }

    const newVendors = vendors.filter((v) => v.vendor_id !== vendor_id);
    updateVendors(newVendors);
  };

  const handleOpenForm = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData(vendor);
    } else {
      setEditingVendor(null);
      setFormData({
        name: "",
        contact_person: "",
        payment_terms: "",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingVendor(null);
    setFormData({
      name: "",
      contact_person: "",
      payment_terms: "",
    });
  };

  async function createVendor() {
    const { data, error } = await supabase
      .from("vendors")
      .insert({
        name: formData.name,
        contact_person: formData.contact_person,
        payment_terms: formData.payment_terms,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating vendor:", error);
      return;
    }

    const newVendors = [...vendors, data];
    updateVendors(newVendors);
  }

  async function updateVendor() {
    if (!editingVendor) return;

    const { data, error } = await supabase
      .from("vendors")
      .update({
        name: formData.name,
        contact_person: formData.contact_person,
        payment_terms: formData.payment_terms,
      })
      .eq("vendor_id", editingVendor.vendor_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating vendor:", error);
      return;
    }

    const newVendors = vendors.map((v) =>
      v.vendor_id === editingVendor.vendor_id ? data : v,
    );

    updateVendors(newVendors);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) return;

    if (editingVendor) {
      await updateVendor();
    } else {
      await createVendor();
    }

    handleCloseForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-violet-600">
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
                  placeholder="Search vendors..."
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
                Add Vendor
              </Button>
            </div>

            {/* Vendors Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Vendor Directory
                      <Badge className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                        {vendors.length}
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
                        Vendor ID
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Company Name
                      </TableHead>
                      <TableHead className="text-violet-600 font-semibold">
                        Contact Person
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
                    {filteredVendors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Store className="w-8 h-8 text-slate-300" />
                            <p>No vendors found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVendors.map((vendor) => (
                        <TableRow
                          key={vendor.vendor_id}
                          className="hover:bg-violet-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-violet-600">
                              {vendor.vendor_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <span className="font-medium text-slate-900">
                                {vendor.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {vendor.contact_person ? (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900">
                                  {vendor.contact_person}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">
                                ─
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {vendor.payment_terms ? (
                              <Badge
                                variant="outline"
                                className="border-violet-300 text-violet-700"
                              >
                                {vendor.payment_terms}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">
                                Not specified
                              </span>
                            )}
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
                                <DropdownMenuItem
                                  className="text-slate-700 cursor-pointer hover:bg-violet-50 hover:text-violet-600"
                                  onClick={() => handleOpenForm(vendor)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-violet-600" />
                                  Edit Vendor
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(vendor.vendor_id)}
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

      {/* Add/Edit Vendor Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-violet-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-violet-600">
              <div className="p-2 rounded-lg bg-violet-50">
                {editingVendor ? (
                  <Pencil className="w-5 h-5 text-violet-600" />
                ) : (
                  <Plus className="w-5 h-5 text-violet-600" />
                )}
              </div>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingVendor
                ? "Update the vendor details below."
                : "Fill in the details to register a new vendor."}
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
              <Label htmlFor="contact_person" className="text-slate-700">
                Contact Person
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="contact_person"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact_person: e.target.value,
                    }))
                  }
                  className="pl-10 border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms" className="text-slate-700">
                Payment Terms
              </Label>
              <Input
                id="payment_terms"
                placeholder="e.g., Net 30, Due on Receipt"
                value={formData.payment_terms || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payment_terms: e.target.value,
                  }))
                }
                className="border-slate-200 focus:border-violet-600 focus:ring-violet-600/20"
              />
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
                {editingVendor ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Vendor
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
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
