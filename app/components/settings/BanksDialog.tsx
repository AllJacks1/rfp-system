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
  Landmark,
  Trash2,
  Eye,
  Pencil,
  Building2,
  CreditCard,
  X,
  DollarSign,
  MapPin,
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

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: "Checking" | "Savings" | "Credit" | "Loan";
  currency: string;
  branch: string;
  balance: string;
  status: "active" | "inactive";
}

const mockAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "Chase Bank",
    accountName: "Primary Operating",
    accountNumber: "****4567",
    accountType: "Checking",
    currency: "USD",
    branch: "Main Street",
    balance: "$125,450.00",
    status: "active",
  },
  {
    id: "2",
    bankName: "Bank of America",
    accountName: "Payroll Account",
    accountNumber: "****8901",
    accountType: "Checking",
    currency: "USD",
    branch: "Downtown",
    balance: "$45,200.00",
    status: "active",
  },
  {
    id: "3",
    bankName: "Wells Fargo",
    accountName: "Reserve Savings",
    accountNumber: "****2345",
    accountType: "Savings",
    currency: "USD",
    branch: "Westside",
    balance: "$75,000.00",
    status: "active",
  },
  {
    id: "4",
    bankName: "HSBC",
    accountName: "International",
    accountNumber: "****6789",
    accountType: "Checking",
    currency: "EUR",
    branch: "London",
    balance: "€25,000.00",
    status: "active",
  },
];

const currencyOptions = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "PHP"];

interface BanksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BanksDialog({ open, onOpenChange }: BanksDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountType: "Checking",
    currency: "USD",
    branch: "",
    balance: "$0.00",
    status: "active",
  });

  const activeAccounts = accounts.filter((a) => a.status === "active");
  const filteredAccounts = activeAccounts.filter(
    (a) =>
      a.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleOpenForm = (account?: BankAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData(account);
    } else {
      setEditingAccount(null);
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
        accountType: "Checking",
        currency: "USD",
        branch: "",
        balance: "$0.00",
        status: "active",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingAccount(null);
    setFormData({
      bankName: "",
      accountName: "",
      accountNumber: "",
      accountType: "Checking",
      currency: "USD",
      branch: "",
      balance: "$0.00",
      status: "active",
    });
  };

  const formatAccountNumber = (value: string) => {
    // Keep only last 4 digits masked for display, full input for editing
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 4) {
      return "*".repeat(cleaned.length - 4) + cleaned.slice(-4);
    }
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedAccountNumber = formData.accountNumber 
      ? formatAccountNumber(formData.accountNumber)
      : "****0000";

    if (editingAccount) {
      // Update existing
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingAccount.id
            ? { ...a, ...(formData as BankAccount), accountNumber: formattedAccountNumber }
            : a
        )
      );
    } else {
      // Create new
      const newAccount: BankAccount = {
        id: Math.random().toString(36).substr(2, 9),
        bankName: formData.bankName || "",
        accountName: formData.accountName || "",
        accountNumber: formattedAccountNumber,
        accountType: (formData.accountType as BankAccount["accountType"]) || "Checking",
        currency: formData.currency || "USD",
        branch: formData.branch || "",
        balance: formData.balance || "$0.00",
        status: "active",
      };
      setAccounts((prev) => [...prev, newAccount]);
    }

    handleCloseForm();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Checking":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Savings":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Credit":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Loan":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[950px] lg:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-cyan-600">
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
                Add Bank Account
              </Button>
            </div>

            {/* Bank Accounts Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Bank Accounts
                      <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200">
                        {activeAccounts.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Connected financial institutions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-cyan-600 font-semibold">
                        Bank
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Account Name
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Account Number
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Type
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Currency
                      </TableHead>
                      <TableHead className="text-cyan-600 font-semibold">
                        Balance
                      </TableHead>
                      <TableHead className="w-[100px] text-cyan-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Landmark className="w-8 h-8 text-slate-300" />
                            <p>No bank accounts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          className="hover:bg-cyan-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {account.bankName}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {account.branch} Branch
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-900 font-medium">
                            {account.accountName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              <span className="font-mono text-slate-600">
                                {account.accountNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getTypeColor(account.accountType)}
                            >
                              {account.accountType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-slate-100 text-slate-700 border-0 font-mono">
                              {account.currency}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {account.balance}
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
                                <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-cyan-50 hover:text-cyan-600">
                                  <Eye className="w-4 h-4 mr-2 text-cyan-600" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-slate-700 cursor-pointer hover:bg-cyan-50 hover:text-cyan-600"
                                  onClick={() => handleOpenForm(account)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-cyan-600" />
                                  Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(account.id)}
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

      {/* Add/Edit Bank Account Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 border-t-4 border-t-cyan-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-cyan-600">
              <div className="p-2 rounded-lg bg-cyan-50">
                {editingAccount ? (
                  <Pencil className="w-5 h-5 text-cyan-600" />
                ) : (
                  <Plus className="w-5 h-5 text-cyan-600" />
                )}
              </div>
              {editingAccount ? "Edit Account" : "Add Bank Account"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingAccount
                ? "Update the bank account details below."
                : "Fill in the details to connect a new bank account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-slate-700">
                Bank Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="bankName"
                  placeholder="e.g., Chase Bank"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bankName: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-slate-700">
                Account Name
              </Label>
              <Input
                id="accountName"
                placeholder="e.g., Primary Operating"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accountName: e.target.value,
                  }))
                }
                className="border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-slate-700">
                Account Number
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="accountNumber"
                  placeholder="Enter full account number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20 font-mono"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">
                Only last 4 digits will be displayed (e.g., ****4567)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountType" className="text-slate-700">
                  Account Type
                </Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountType: value as BankAccount["accountType"],
                    }))
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Loan">Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-slate-700">
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-slate-700">
                Branch Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="branch"
                  placeholder="e.g., Main Street"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance" className="text-slate-700">
                Opening Balance
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="balance"
                  placeholder="$0.00"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, balance: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-cyan-600 focus:ring-cyan-600/20 font-mono"
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
                {editingAccount ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Account
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
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