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
  Lock,
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
  onCreate,
  onEdit,
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
    password: "",
    new_password: "",
    confirm_password: "",
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        (b) => b.company?.company_id.toString() === companyId.toString(),
      );
      setAvailableBranches(filteredBranches);
      // Reset branch and department if company changes
      if (
        !editingAccount ||
        editingAccount.company_id.toString() !== companyId.toString()
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
        (d) => d.branch_id?.toString() === branchId.toString(),
      );
      setAvailableDepartments(filteredDepartments);
      // Reset department if branch changes (and not editing)
      if (
        !editingAccount ||
        editingAccount.branch_id?.toString() !== branchId.toString()
      ) {
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
        password: "",
        new_password: "",
        confirm_password: "",
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
        password: "",
        new_password: "",
        confirm_password: "",
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
      password: "",
      new_password: "",
      confirm_password: "",
    });
    setAvailableBranches([]);
    setAvailableDepartments([]);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!editingAccount) {
        // Validate password for new account
        if (!formData.password) {
          alert("Password is required");
          return;
        }

        if (onCreate) {
          await onCreate({
            email: formData.email,
            password: formData.password,
            username: formData.email,
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            mobile_number: formData.mobile_number,
            address: formData.address,
            birthday: formData.birthday,
            sex: formData.sex,
            company_id: formData.company_id,
            branch_id: formData.branch_id,
            department_id: formData.department_id,
            designation_id: formData.designation_id,
            role_id: formData.role_id,
          });
        }

        // OPTIONAL: refresh page data
        window.location.reload();
      } else {
        if (!onEdit || !editingAccount) return;

        // Validate password if provided
        if (formData.new_password || formData.confirm_password) {
          if (formData.new_password !== formData.confirm_password) {
            alert("New password and confirm password do not match");
            return;
          }
        }

        await onEdit({
          user_id: editingAccount.user_id,

          email: formData.email,
          password: formData.new_password || "",
          username: formData.email,

          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          mobile_number: formData.mobile_number,
          address: formData.address,
          birthday: formData.birthday,
          sex: formData.sex,

          company_id: formData.company_id,
          branch_id: formData.branch_id,
          department_id: formData.department_id,
          designation_id: formData.designation_id,
          role_id: formData.role_id,
        });

        // OPTIONAL refresh
        window.location.reload();
      }

      handleCloseForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
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
          className="w-[95vw] max-w-[95vw] sm:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
          showCloseButton={false}
        >
          {viewingAccount && (
            <>
              {/* Header with avatar */}
              <div className="bg-gradient-to-br from-[#2B3A9F] to-[#1e2870] p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold border-2 border-white/30 shrink-0">
                      {getNameInitials(viewingAccount)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                        {getFullName(viewingAccount)}
                      </h2>
                      <p className="text-white/80 flex items-center gap-2 mt-1 text-sm sm:text-base lg:text-lg">
                        <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                        <span className="truncate">
                          {viewingAccount.role_name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDetailsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10 shrink-0"
                  >
                    <X className="w-5 h-5 lg:w-6 lg:h-6" />
                  </Button>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Organizational Information - 2 columns on large screens */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B3A9F]" />
                    Organizational Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {[
                      {
                        icon: Briefcase,
                        label: "Role",
                        value: viewingAccount.role_name,
                      },
                      {
                        icon: UserCog,
                        label: "Designation",
                        value: viewingAccount.designation_name,
                      },
                      {
                        icon: Building2,
                        label: "Company",
                        value: viewingAccount.company_name,
                      },
                      {
                        icon: MapPin,
                        label: "Branch",
                        value: viewingAccount.branch_location,
                      },
                      {
                        icon: Building,
                        label: "Department",
                        value: viewingAccount.department_name,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2B3A9F]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs lg:text-sm text-slate-500">
                            {item.label}
                          </p>
                          <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg truncate">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Personal Info - Side by side on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Contact Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B3A9F]" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2B3A9F]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs lg:text-sm text-slate-500">
                            Email
                          </p>
                          <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg truncate">
                            {viewingAccount.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2B3A9F]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs lg:text-sm text-slate-500">
                            Mobile
                          </p>
                          <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg truncate">
                            {viewingAccount.mobile_number || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B3A9F]" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#2B3A9F]/100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2B3A9F]" />
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm text-slate-500">
                            Sex
                          </p>
                          <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg">
                            {viewingAccount.sex || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#2B3A9F]/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2B3A9F]" />
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm text-slate-500">
                            Birthday
                          </p>
                          <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg">
                            {formatDate(viewingAccount.birthday)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B3A9F]" />
                    Address
                  </h3>
                  <div className="p-3 sm:p-4 lg:p-5 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900 text-sm sm:text-base lg:text-lg break-words">
                      {viewingAccount.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
                  <Button
                    variant="outline"
                    onClick={() => setDetailsOpen(false)}
                    className="flex-1 border-slate-200 hover:bg-slate-50 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
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

            {/* Password Section - Different for Create vs Edit */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="w-4 h-4 text-[#2B3A9F]" />
                {editingAccount ? "Change Password (Optional)" : "Set Password"}
              </h3>

              {!editingAccount ? (
                // Create Mode: Single required password field
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="pl-10 pr-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                      required={!editingAccount}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode: New password and confirm password (optional)
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_password" className="text-slate-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Leave blank to keep current password"
                        value={formData.new_password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            new_password: e.target.value,
                          }))
                        }
                        className="pl-10 pr-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm_password"
                      className="text-slate-700"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirm_password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirm_password: e.target.value,
                          }))
                        }
                        className="pl-10 pr-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
