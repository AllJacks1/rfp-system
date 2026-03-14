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
  UserCog,
  UserX,
  Eye,
  KeyRound,
  Pencil,
  X,
  Mail,
  User,
  Shield,
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

interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
}

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "active",
    lastActive: "5 mins ago",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Viewer",
    status: "inactive",
    lastActive: "3 days ago",
  },
];

const roleOptions = ["Admin", "Editor", "Viewer", "Manager", "Finance"];

interface UserAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserAccountDialog({
  open,
  onOpenChange,
}: UserAccountDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Account>>({
    name: "",
    email: "",
    role: "Viewer",
    status: "active",
  });

  const activeAccounts = accounts.filter((a) => a.status === "active");
  const filteredAccounts = activeAccounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeactivate = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "inactive" } : a))
    );
  };

  const handleOpenForm = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData(account);
    } else {
      setEditingAccount(null);
      setFormData({
        name: "",
        email: "",
        role: "Viewer",
        status: "active",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingAccount(null);
    setFormData({
      name: "",
      email: "",
      role: "Viewer",
      status: "active",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAccount) {
      // Update existing
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingAccount.id ? { ...a, ...(formData as Account) } : a
        )
      );
    } else {
      // Create new
      const newAccount: Account = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "",
        email: formData.email || "",
        role: formData.role || "Viewer",
        status: "active",
        lastActive: "Just now",
      };
      setAccounts((prev) => [...prev, newAccount]);
    }

    handleCloseForm();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] lg:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                <UserCog className="w-6 h-6 text-[#2B3A9F]" />
              </div>
              User Accounts
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage your team members and their account permissions here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                />
              </div>
              <Button
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>

            {/* Active Accounts Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Active Accounts
                      <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                        {activeAccounts.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Currently active team members with access to the platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        User
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Role
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Last Active
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="w-[100px] text-[#2B3A9F] font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <UserCog className="w-8 h-8 text-slate-300" />
                            <p>No active accounts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          className="hover:bg-[#2B3A9F]/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F] font-semibold text-sm">
                                {getInitials(account.name)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {account.name}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {account.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-[#2B3A9F]/30 text-[#2B3A9F]"
                            >
                              {account.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {account.lastActive}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                account.status === "active"
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-0"
                              }
                            >
                              {account.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-[#2B3A9F]/10 hover:text-[#2B3A9F]"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs text-slate-500">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                  <Eye className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]"
                                  onClick={() => handleOpenForm(account)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                  <KeyRound className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  Page and Section Access
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDeactivate(account.id)}
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deactivate
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

      {/* Add/Edit User Account Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                {editingAccount ? (
                  <Pencil className="w-5 h-5 text-[#2B3A9F]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#2B3A9F]" />
                )}
              </div>
              {editingAccount ? "Edit Account" : "Create New Account"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingAccount
                ? "Update the user account details below."
                : "Fill in the details to create a new team member account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700">
                Role
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingAccount && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Current Status</span>
                  <Badge
                    className={
                      editingAccount.status === "active"
                        ? "bg-emerald-100 text-emerald-700 border-0"
                        : "bg-slate-100 text-slate-600 border-0"
                    }
                  >
                    {editingAccount.status}
                  </Badge>
                </div>
              </div>
            )}

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
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
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