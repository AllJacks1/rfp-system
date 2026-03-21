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
  BookOpen,
  Trash2,
  Pencil,
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
import { Account, ChartOfAccountsDialogProps } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

export default function ChartOfAccountsDialog({
  open,
  onOpenChange,
  accounts: initialAccounts = [],
  onAccountsChange,
}: ChartOfAccountsDialogProps & {
  onAccountsChange?: (accounts: Account[]) => void;
}) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Sync with external accounts prop
  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);

  // Form state
  const [formData, setFormData] = useState<Partial<Account>>({
    account_id: "",
    account_type: "Asset",
    name: "",
  });

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.account_id.includes(searchQuery) ||
      a.account_type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const updateAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    onAccountsChange?.(newAccounts);
  };

  const handleRemove = async (account_id: string) => {
    const { error } = await supabase
      .from("chart_of_accounts")
      .delete()
      .eq("account_id", account_id);

    if (error) {
      console.error("Error deleting account:", error);
      return;
    }

    const newAccounts = accounts.filter((a) => a.account_id !== account_id);
    updateAccounts(newAccounts);
  };

  const handleOpenForm = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData(account);
    } else {
      setEditingAccount(null);
      setFormData({
        account_id: "",
        account_type: "Asset",
        name: "",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingAccount(null);
    setFormData({
      account_id: "",
      account_type: "Asset",
      name: "",
    });
  };

  async function createAccount(account_type: string, name: string) {
    const { data, error } = await supabase
      .from("chart_of_accounts")
      .insert({
        account_type,
        name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating account:", error);
      return;
    }

    const newAccounts = [...accounts, data];
    updateAccounts(newAccounts);
  }

  async function editAccount(account_type: string, name: string) {
    if (!editingAccount) return;

    const { data, error } = await supabase
      .from("chart_of_accounts")
      .update({
        account_type,
        name,
      })
      .eq("account_id", editingAccount.account_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating account:", error);
      return;
    }

    const newAccounts = accounts.map((account) =>
      account.account_id === editingAccount.account_id ? data : account,
    );

    updateAccounts(newAccounts);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.account_type) return;

    if (editingAccount) {
      await editAccount(formData.account_type, formData.name);
    } else {
      await createAccount(formData.account_type, formData.name);
    }

    handleCloseForm();
  };

  const getTypeColor = (account_type: string) => {
    switch (account_type) {
      case "Asset":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Liability":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Equity":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Revenue":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Expense":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-indigo-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-indigo-600">
              <div className="p-2 rounded-lg bg-indigo-50">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              Chart of Accounts
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage account titles, types, and classifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20"
                />
              </div>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </div>

            {/* Accounts Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Accounts
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200">
                        {accounts.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Financial accounts and classifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-indigo-600 font-semibold">
                        Account ID
                      </TableHead>
                      <TableHead className="text-indigo-600 font-semibold">
                        Account Name
                      </TableHead>
                      <TableHead className="text-indigo-600 font-semibold">
                        Account Type
                      </TableHead>
                      <TableHead className="w-[100px] text-indigo-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <BookOpen className="w-8 h-8 text-slate-300" />
                            <p>No accounts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow
                          key={account.account_id}
                          className="hover:bg-indigo-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-indigo-600">
                              {account.account_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-slate-900">
                              {account.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getTypeColor(account.account_type)}
                            >
                              {account.account_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-indigo-100 hover:text-indigo-600"
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
                                  className="text-slate-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"
                                  onClick={() => handleOpenForm(account)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-indigo-600" />
                                  Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() =>
                                    handleRemove(account.account_id)
                                  }
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

      {/* Add/Edit Account Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-indigo-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-indigo-600">
              <div className="p-2 rounded-lg bg-indigo-50">
                {editingAccount ? (
                  <Pencil className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Plus className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              {editingAccount ? "Edit Account" : "Add New Account"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingAccount
                ? "Update the account details below."
                : "Fill in the details to create a new account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Account Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Cash and Cash Equivalents"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_type" className="text-slate-700">
                Account Type
              </Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    account_type: value,
                  }))
                }
              >
                <SelectTrigger className="border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOE">Direct Operating Expense</SelectItem>
                  <SelectItem value="GAE">
                    General Administrative Expenses
                  </SelectItem>
                </SelectContent>
              </Select>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {editingAccount ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Account
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Account
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
