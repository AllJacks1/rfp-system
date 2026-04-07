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
  Landmark,
  Trash2,
  Pencil,
  Building2,
  X,
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
import { Bank, BanksDialogProps } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function BanksDialog({
  open,
  onOpenChange,
  banks: initialBanks = [],
  onBanksChange,
}: BanksDialogProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [bankName, setBankName] = useState("");

  // Sync with external banks prop
  useEffect(() => {
    setBanks(initialBanks);
  }, [initialBanks]);

  const filteredBanks = banks.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bank_id.includes(searchQuery),
  );

  const updateBanks = (newBanks: Bank[]) => {
    setBanks(newBanks);
    onBanksChange?.(newBanks);
  };

  const handleRemove = async (bank_id: string) => {
    // Find bank details before deletion for the toast message
    const bankToDelete = banks.find((b) => b.bank_id === bank_id);
    const bankName = bankToDelete?.name || "Bank";

    const { error } = await supabase
      .from("banks")
      .delete()
      .eq("bank_id", bank_id);

    if (error) {
      console.error("Error deleting bank:", error);
      toast.error("Failed to delete bank", {
        description:
          error.message || "An error occurred while deleting the bank.",
      });
      return;
    }

    const newBanks = banks.filter((b) => b.bank_id !== bank_id);
    updateBanks(newBanks);

    toast.success("Bank deleted successfully", {
      description: `${bankName} has been removed.`,
    });
  };

  const handleOpenForm = (bank?: Bank) => {
    if (bank) {
      setEditingBank(bank);
      setBankName(bank.name);
    } else {
      setEditingBank(null);
      setBankName("");
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingBank(null);
    setBankName("");
  };

  async function createBank(name: string) {
    const { data, error } = await supabase
      .from("banks")
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error("Error creating bank:", error);
      toast.error("Failed to create bank", {
        description:
          error.message || "An error occurred while creating the bank.",
      });
      return;
    }

    const newBanks = [...banks, data];
    updateBanks(newBanks);

    toast.success("Bank created successfully", {
      description: `${name} has been added.`,
    });
  }

  async function updateBank(name: string) {
    if (!editingBank) return;

    const previousName = editingBank.name;

    const { data, error } = await supabase
      .from("banks")
      .update({ name })
      .eq("bank_id", editingBank.bank_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating bank:", error);
      toast.error("Failed to update bank", {
        description:
          error.message || "An error occurred while updating the bank.",
      });
      return;
    }

    const newBanks = banks.map((b) =>
      b.bank_id === editingBank.bank_id ? data : b,
    );

    updateBanks(newBanks);

    // Show different message if name was changed
    const nameChanged = previousName !== name;
    toast.success("Bank updated successfully", {
      description: nameChanged
        ? `${previousName} has been renamed to ${name}.`
        : `${name} has been updated.`,
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankName) return;

    if (editingBank) {
      await updateBank(bankName);
    } else {
      await createBank(bankName);
    }

    handleCloseForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-cyan-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-cyan-600">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Landmark className="w-6 h-6 text-cyan-600" />
              </div>
              Banks & Institutions
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Configure and manage bank accounts and financial institutions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
                <Input
                  placeholder="Search banks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20"
                />
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bank
              </Button>
            </div>

            {/* Banks Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Bank Directory
                      <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200">
                        {banks.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Financial institutions and banks
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-cyan-600 font-semibold">
                        Bank ID
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Bank Name
                      </TableHead>
                      <TableHead className="w-[100px] text-cyan-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanks.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Landmark className="w-8 h-8 text-slate-300" />
                            <p>No banks found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBanks.map((bank) => (
                        <TableRow
                          key={bank.bank_id}
                          className="hover:bg-cyan-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-cyan-600">
                              {bank.bank_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <span className="font-medium text-slate-900">
                                {bank.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-cyan-100 hover:text-cyan-600"
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
                                  className="text-slate-700 cursor-pointer hover:bg-cyan-50 hover:text-cyan-600"
                                  onClick={() => handleOpenForm(bank)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-cyan-600" />
                                  Edit Bank
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(bank.bank_id)}
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

      {/* Add/Edit Bank Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-cyan-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-cyan-600">
              <div className="p-2 rounded-lg bg-cyan-50">
                {editingBank ? (
                  <Pencil className="w-5 h-5 text-cyan-600" />
                ) : (
                  <Plus className="w-5 h-5 text-cyan-600" />
                )}
              </div>
              {editingBank ? "Edit Bank" : "Add New Bank"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingBank
                ? "Update the bank details below."
                : "Fill in the details to add a new bank."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Bank Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Chase Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20"
                  required
                />
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
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {editingBank ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Bank
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bank
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
