"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { CardDescription } from "@/components/ui/card";
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
  Phone,
  Calendar,
  Building,
  Briefcase,
  Building2,
  MapPin,
  User,
  Save,
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
import {
  Branch,
  Department,
  FlattendUser,
  UserAccountDialogProps,
} from "@/lib/interfaces";

export default function UserAccountDialog({
  open,
  onOpenChange,
  users,
  companies,
  branches,
  departments,
  designations,
  roles,
}: UserAccountDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState(users);
  const [viewingAccount, setViewingAccount] = useState<FlattendUser | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FlattendUser | null>(
    null,
  );

  // Form state - using string for all inputs to avoid null issues
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    mobile_number: "",
    address: "",
    birthday: "",
    sex: "",
    company_id: "",
    branch_id: "",
    department_id: "",
    designation_id: "",
    role_id: "",
  });

  // Cascading options state
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<
    Department[]
  >([]);

  // Sync accounts when users prop changes
  useEffect(() => {
    setAccounts(users);
  }, [users]);

  // Filter accounts
  const filteredAccounts = (accounts || []).filter(
    (a) =>
      a.first_name
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      a.last_name
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      a.email?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role_name
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      a.department_name
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Update cascading dropdowns when company changes
  useEffect(() => {
    if (formData.company_id) {
      const companyId = parseInt(formData.company_id);
      const filteredBranches = branches.filter(
        (b) => b.company?.company_id === companyId.toString(),
      );
      setAvailableBranches(filteredBranches);
      // Reset branch and department if company changes
      if (
        !editingAccount ||
        editingAccount.company_id !== companyId.toString()
      ) {
        setFormData((prev) => ({ ...prev, branch_id: "", department_id: "" }));
        setAvailableDepartments([]);
      }
    } else {
      setAvailableBranches([]);
      setAvailableDepartments([]);
    }
  }, [formData.company_id, editingAccount, branches]);

  // Update departments when branch changes
  useEffect(() => {
    if (formData.branch_id) {
      const branchId = parseInt(formData.branch_id);
      const filteredDepartments = departments.filter(
        (d) => d.branch_id === branchId.toString(),
      );
      setAvailableDepartments(filteredDepartments);
      // Reset department if branch changes (and not editing)
      if (!editingAccount || editingAccount.branch_id !== branchId.toString()) {
        setFormData((prev) => ({ ...prev, department_id: "" }));
      }
    } else {
      setAvailableDepartments([]);
    }
  }, [formData.branch_id, editingAccount, departments]);

  // Handlers
  const handleViewDetails = (account: FlattendUser) => {
    setViewingAccount(account);
    setDetailsOpen(true);
  };

  const handleOpenForm = (account?: FlattendUser) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        first_name: account.first_name,
        last_name: account.last_name,
        middle_name: account.middle_name || "",
        email: account.email,
        mobile_number: account.mobile_number || "",
        address: account.address || "",
        birthday: account.birthday || "",
        sex: account.sex || "",
        company_id: account.company_id.toString(),
        branch_id: account.branch_id.toString(),
        department_id: account.department_id.toString(),
        designation_id: account.designation_id.toString(),
        role_id: account.role_id.toString(),
      });
      // Pre-populate cascading options
      setAvailableBranches(
        branches.filter((b) => b.company?.company_id === account.company_id),
      );
      setAvailableDepartments(
        departments.filter((d) => d.branch_id === account.branch_id),
      );
    } else {
      setEditingAccount(null);
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        mobile_number: "",
        address: "",
        birthday: "",
        sex: "",
        company_id: "",
        branch_id: "",
        department_id: "",
        designation_id: "",
        role_id: "",
      });
      setAvailableBranches([]);
      setAvailableDepartments([]);
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingAccount(null);
    setFormData({
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      mobile_number: "",
      address: "",
      birthday: "",
      sex: "",
      company_id: "",
      branch_id: "",
      department_id: "",
      designation_id: "",
      role_id: "",
    });
    setAvailableBranches([]);
    setAvailableDepartments([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const company = companies.find((c) => c.company_id === formData.company_id);
    const branch = branches.find((b) => b.branch_id === formData.branch_id);
    const department = departments.find(
      (d) => d.department_id === formData.department_id,
    );
    const designation = designations.find(
      (d) => d.designation_id === parseInt(formData.designation_id),
    );
    const role = roles.find((r) => r.role_id === formData.role_id);

    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.user_id === editingAccount.user_id
            ? {
                ...a,
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name || null,
                email: formData.email,
                mobile_number: formData.mobile_number || null,
                address: formData.address || null,
                birthday: formData.birthday || null,
                sex: formData.sex || null,
                company_id: formData.company_id,
                company_name: company?.name || a.company_name,
                branch_id: formData.branch_id,
                branch_location: branch?.location || a.branch_location,
                department_id: formData.department_id,
                department_name: department?.name || a.department_name,
                designation_id: formData.designation_id,
                designation_name: designation?.name || a.designation_name,
                role_id: formData.role_id,
                role_name: role?.name || a.role_name,
              }
            : a,
        ),
      );
    } else {
      const newAccount: FlattendUser = {
        user_id: "1",
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name || null,
        email: formData.email,
        mobile_number: formData.mobile_number || null,
        address: formData.address || null,
        birthday: formData.birthday || null,
        sex: formData.sex || null,
        company_id: formData.company_id,
        company_name: company?.name || "",
        branch_id: formData.branch_id,
        branch_location: branch?.location || "",
        department_id: formData.department_id,
        department_name: department?.name || "",
        designation_id: formData.designation_id,
        designation_name: designation?.name || "",
        role_id: formData.role_id,
        role_name: role?.name || "",
      };
      setAccounts((prev) => [...prev, newAccount]);
    }

    handleCloseForm();
  };

  const handleDeactivate = (user_id: string) => {
    setAccounts((prev) => prev.filter((a) => a.user_id !== user_id));
  };

  // Helpers
  const getFullName = (account: FlattendUser) => {
    const middle = account.middle_name ? ` ${account.middle_name}` : "";
    return `${account.first_name}${middle} ${account.last_name}`;
  };

  const getNameInitials = (account: FlattendUser) => {
    return `${account.first_name[0]}${account.last_name[0]}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              Manage team members and their organizational assignments
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

            {/* Accounts Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  Active Accounts
                  <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                    {(accounts || []).length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  Team members with their organizational assignments
                </CardDescription>
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
                        Department
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
                          colSpan={4}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <UserCog className="w-8 h-8 text-slate-300" />
                            <p>No accounts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow
                          key={account.user_id}
                          className="hover:bg-[#2B3A9F]/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F] font-semibold text-sm">
                                {getNameInitials(account)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {getFullName(account)}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {account.email || "No email"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {account.role_name}
                              </span>
                              <span className="text-sm text-slate-500">
                                {account.designation_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20 w-fit">
                                {account.department_name}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {account.branch_location} •{" "}
                                {account.company_name}
                              </span>
                            </div>
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
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(account)}
                                  className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]"
                                >
                                  <Eye className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenForm(account)}
                                  className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]"
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
                                  onClick={() =>
                                    handleDeactivate(account.user_id)
                                  }
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

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          className="sm:max-w-[600px] p-0 overflow-hidden"
          showCloseButton={false}
        >
          {viewingAccount && (
            <>
              {/* Header with avatar */}
              <div className="bg-gradient-to-br from-[#2B3A9F] to-[#1e2870] p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                      {getNameInitials(viewingAccount)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {getFullName(viewingAccount)}
                      </h2>
                      <p className="text-white/80 flex items-center gap-2 mt-1">
                        <Briefcase className="w-4 h-4" />
                        {viewingAccount.role_name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDetailsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-6 space-y-6">
                {/* Organizational Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#2B3A9F]" />
                    Organizational Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Role</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.role_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Designation</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.designation_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Company</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.company_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Branch</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.branch_location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Department</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.department_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#2B3A9F]" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Mobile</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.mobile_number || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2B3A9F]" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Sex</p>
                        <p className="font-medium text-slate-900">
                          {viewingAccount.sex || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#2B3A9F]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Birthday</p>
                        <p className="font-medium text-slate-900">
                          {formatDate(viewingAccount.birthday)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2B3A9F]" />
                    Address
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900">
                      {viewingAccount.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setDetailsOpen(false)}
                    className="flex-1 border-slate-200 hover:bg-slate-50"
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
                    onClick={() => {
                      setDetailsOpen(false);
                      handleOpenForm(viewingAccount);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Account
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[700px] w-full max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <DialogHeader>
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
                  ? "Update the user account details and organizational assignments."
                  : "Fill in the details to create a new team member account."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-[#2B3A9F]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name" className="text-slate-700">
                    Middle Name
                  </Label>
                  <Input
                    id="middle_name"
                    placeholder="Michael"
                    value={formData.middle_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        middle_name: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-slate-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex" className="text-slate-700">
                    Sex
                  </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, sex: value }))
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-slate-700">
                    Birthday
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        birthday: e.target.value,
                      }))
                    }
                    className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Mail className="w-4 h-4 text-[#2B3A9F]" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_number" className="text-slate-700">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="mobile_number"
                      placeholder="09123456789"
                      value={formData.mobile_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mobile_number: e.target.value,
                        }))
                      }
                      className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-700">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="address"
                      placeholder="Davao City, Philippines"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizational Assignment Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building className="w-4 h-4 text-[#2B3A9F]" />
                Organizational Assignment
              </h3>

              <div className="space-y-4">
                {/* Company Selection */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-700">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.company_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        company_id: value,
                        branch_id: "",
                        department_id: "",
                      }))
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {(companies || []).map((company) => (
                        <SelectItem
                          key={company.company_id}
                          value={company.company_id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Selection (Cascading) */}
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-slate-700">
                    Branch <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        branch_id: value,
                        department_id: "",
                      }))
                    }
                    disabled={
                      !formData.company_id || availableBranches.length === 0
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue
                        placeholder={
                          !formData.company_id
                            ? "Select a company first"
                            : availableBranches.length === 0
                              ? "No branches available"
                              : "Select a branch"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBranches.map((branch) => (
                        <SelectItem
                          key={branch.branch_id}
                          value={branch.branch_id.toString()}
                        >
                          {branch.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Selection (Cascading) */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-700">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, department_id: value }))
                    }
                    disabled={
                      !formData.branch_id || availableDepartments.length === 0
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue
                        placeholder={
                          !formData.branch_id
                            ? "Select a branch first"
                            : availableDepartments.length === 0
                              ? "No departments available"
                              : "Select a department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((dept) => (
                        <SelectItem
                          key={dept.department_id}
                          value={dept.department_id.toString()}
                        >
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Designation Selection */}
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-slate-700">
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.designation_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        designation_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {(designations || []).map((desig) => (
                        <SelectItem
                          key={desig.designation_id}
                          value={desig.designation_id.toString()}
                        >
                          {desig.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.role_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role_id: value }))
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles || []).map((role) => (
                        <SelectItem
                          key={role.role_id}
                          value={role.role_id.toString()}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
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
                <Save className="w-4 h-4 mr-2" />
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
