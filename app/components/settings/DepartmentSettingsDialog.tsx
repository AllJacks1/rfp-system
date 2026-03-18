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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Users,
  Trash2,
  Eye,
  Pencil,
  Building2,
  X,
  MapPin,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useMemo, useCallback } from "react";
import {
  Department,
  DepartmentSettingsDialogProps,
  Company,
} from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

const THEME_COLOR = "#2B3A9F";

export default function DepartmentSettingsDialog({
  open,
  onOpenChange,
  departments: initialDepartments,
  branches,
}: DepartmentSettingsDialogProps & { companies?: Company[] }) {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  // Form state
  const [name, setName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Extract companies from branches (since companies prop is undefined)
  const availableCompanies = useMemo(() => {
    const companyMap = new Map<string | number, Company>();

    branches.forEach((branch) => {
      if (branch.company) {
        const companyId = branch.company.company_id;
        if (!companyMap.has(companyId)) {
          companyMap.set(companyId, branch.company);
        }
      }
    });

    return Array.from(companyMap.values());
  }, [branches]);

  // Filter branches by selected company - convert to string for comparison
  const availableBranches = useMemo(() => {
    if (!selectedCompanyId) return [];

    return branches.filter((b) => {
      // Convert both to strings for comparison since IDs might be numbers
      const branchCompanyId = String(b.company?.company_id);
      return branchCompanyId === selectedCompanyId;
    });
  }, [branches, selectedCompanyId]);

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!departments) return [];

    const query = searchQuery.toLowerCase().trim();

    return departments.filter(
      (d) =>
        d.name?.toString().toLowerCase().includes(query) ||
        (d.branch_location || "").toString().toLowerCase().includes(query) ||
        (d.branch_id || "").toString().toLowerCase().includes(query) ||
        (d.company_id || "").toString().toLowerCase().includes(query) ||
        (d.company_name || "").toString().toLowerCase().includes(query),
    );
  }, [departments, searchQuery]);

  const activeCount = useMemo(() => departments.length, [departments]);

  const handleRemove = useCallback((id: string) => {
    setDepartments((prev) => prev.filter((d) => d.department_id !== id));
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setSelectedCompanyId("");
    setSelectedBranchId("");
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingDepartment(null);
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((dept: Department) => {
    setEditingDepartment(dept);
    setName(dept.name);
    // Convert to string since Select component uses strings
    setSelectedCompanyId(dept.company_id ? String(dept.company_id) : "");
    setSelectedBranchId(dept.branch_id ? String(dept.branch_id) : "");
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingDepartment(null);
    resetForm();
  }, [resetForm]);

  // When company changes, reset branch selection
  const handleCompanyChange = useCallback((value: string) => {
    setSelectedCompanyId(value);
    setSelectedBranchId(""); // Reset branch when company changes
  }, []);

  async function createDepartment(name: string, branch_id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("departments")
      .insert([{ name, branch_id }])
      .select()
      .single(); // important: return single object

    if (error) throw error;

    return data;
  }

  async function updateDepartment(
    department_id: string,
    name: string,
    branch_id: string,
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("departments")
      .update({ name, branch_id })
      .eq("department_id", department_id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !selectedBranchId) return;

      const selectedBranch = branches.find(
        (b) => String(b.branch_id) === selectedBranchId,
      );

      const selectedCompany = availableCompanies.find(
        (c) => String(c.company_id) === selectedCompanyId,
      );

      try {
        if (editingDepartment) {
          // ── UPDATE EXISTING ───────────────────────────────────────
          const updated = await updateDepartment(
            editingDepartment.department_id,
            name.trim(),
            selectedBranchId,
          );

          // Update local state with real data from database
          setDepartments((prev) =>
            prev.map((d) =>
              d.department_id === editingDepartment.department_id
                ? {
                    ...d,
                    ...updated, // take all fields returned by DB
                    branch_location:
                      selectedBranch?.location ?? d.branch_location,
                    company_id: selectedCompanyId,
                    company_name: selectedCompany?.name || d.company_name || "",
                  }
                : d,
            ),
          );
        } else {
          // ── CREATE NEW ────────────────────────────────────────────
          const created = await createDepartment(name.trim(), selectedBranchId);

          const newDepartment: Department = {
            ...created, // use real DB data
            branch_location: selectedBranch?.location,
            company_id: selectedCompanyId,
            company_name: selectedCompany?.name || "",
          };

          setDepartments((prev) => [...prev, newDepartment]);
        }

        handleCloseForm();
      } catch (err) {
        console.error("Department save failed:", err);
        // ← TODO: show toast / alert to user in real app
        alert("Failed to save department. Check console for details.");
      }
    },
    [
      editingDepartment,
      name,
      selectedBranchId,
      selectedCompanyId,
      branches,
      availableCompanies,
      handleCloseForm,
    ],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const isFormValid = name.trim().length > 0 && selectedBranchId.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-150 lg:max-w-200 w-full max-h-[90vh] overflow-y-auto p-6 border-t-4"
          style={{ borderTopColor: THEME_COLOR }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle
              className="text-2xl flex items-center gap-2"
              style={{ color: THEME_COLOR }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${THEME_COLOR}15` }}
              >
                <Users className="w-6 h-6" style={{ color: THEME_COLOR }} />
              </div>
              Department Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Organize and manage departments, teams, and reporting structures.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: THEME_COLOR }}
                />
                <Input
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200"
                />
              </div>
              <Button
                className="text-white hover:opacity-90"
                style={{ backgroundColor: THEME_COLOR }}
                onClick={handleOpenCreate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </Button>
            </div>

            {/* Departments Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Departments
                      <Badge
                        variant="secondary"
                        className="border"
                        style={{
                          backgroundColor: `${THEME_COLOR}15`,
                          color: THEME_COLOR,
                          borderColor: `${THEME_COLOR}30`,
                        }}
                      >
                        {activeCount}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Active departments and teams
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead
                        className="font-semibold w-[280px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Department
                      </TableHead>
                      <TableHead
                        className="font-semibold"
                        style={{ color: THEME_COLOR }}
                      >
                        Branch Location
                      </TableHead>
                      <TableHead
                        className="font-semibold"
                        style={{ color: THEME_COLOR }}
                      >
                        Company
                      </TableHead>
                      <TableHead
                        className="font-semibold w-[80px] text-right"
                        style={{ color: THEME_COLOR }}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-10 h-10 text-slate-300" />
                            <p className="text-sm">
                              {searchQuery
                                ? "No departments match your search"
                                : "No departments found"}
                            </p>
                            {searchQuery && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                style={{ color: THEME_COLOR }}
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((dept) => (
                        <TableRow
                          key={dept.department_id}
                          className="transition-colors hover:bg-opacity-5"
                          style={{
                            ["--hover-bg" as string]: `${THEME_COLOR}10`,
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                                style={{
                                  backgroundColor: `${THEME_COLOR}15`,
                                  color: THEME_COLOR,
                                }}
                              >
                                {dept.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium text-slate-900 truncate">
                                  {dept.name}
                                </span>
                                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                  ID: {dept.department_id}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin
                                className="w-4 h-4"
                                style={{ color: THEME_COLOR }}
                              />
                              <span className="text-slate-700">
                                {dept.branch_location || "Not assigned"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building
                                className="w-4 h-4"
                                style={{ color: THEME_COLOR }}
                              />
                              <span className="text-slate-700">
                                {dept.company_name || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-opacity-10"
                                  style={{
                                    ["--hover-bg" as string]: `${THEME_COLOR}15`,
                                    ["--hover-text" as string]: THEME_COLOR,
                                  }}
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
                                  className="cursor-pointer"
                                  style={{
                                    ["--hover-bg" as string]: `${THEME_COLOR}08`,
                                    ["--hover-color" as string]: THEME_COLOR,
                                  }}
                                >
                                  <Eye
                                    className="w-4 h-4 mr-2"
                                    style={{ color: THEME_COLOR }}
                                  />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleOpenEdit(dept)}
                                  style={{
                                    ["--hover-bg" as string]: `${THEME_COLOR}08`,
                                    ["--hover-color" as string]: THEME_COLOR,
                                  }}
                                >
                                  <Pencil
                                    className="w-4 h-4 mr-2"
                                    style={{ color: THEME_COLOR }}
                                  />
                                  Edit Department
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() =>
                                    handleRemove(dept.department_id)
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

      {/* Create/Edit Department Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent
          className="sm:max-w-[500px] p-6 border-t-4"
          style={{ borderTopColor: THEME_COLOR }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle
              className="text-xl flex items-center gap-2"
              style={{ color: THEME_COLOR }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${THEME_COLOR}15` }}
              >
                {editingDepartment ? (
                  <Pencil className="w-5 h-5" style={{ color: THEME_COLOR }} />
                ) : (
                  <Building2
                    className="w-5 h-5"
                    style={{ color: THEME_COLOR }}
                  />
                )}
              </div>
              {editingDepartment ? "Edit Department" : "Create New Department"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingDepartment
                ? "Update the department details below."
                : "Select a company and branch, then enter the department name."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Company Selection */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-700">
                Company <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={selectedCompanyId}
                  onValueChange={handleCompanyChange}
                  disabled={availableCompanies.length === 0}
                >
                  <SelectTrigger
                    className={`pl-10 border-slate-200 ${availableCompanies.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <SelectValue
                      placeholder={
                        availableCompanies.length === 0
                          ? "No companies available"
                          : "Select a company"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((company) => (
                      <SelectItem
                        key={company.company_id}
                        value={String(company.company_id)}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {availableCompanies.length === 0 && (
                <p className="text-xs text-red-600">
                  No companies found. Please add companies first.
                </p>
              )}
            </div>

            {/* Branch Selection (filtered by company) */}
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-slate-700">
                Branch Location <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  disabled={
                    !selectedCompanyId || availableBranches.length === 0
                  }
                >
                  <SelectTrigger
                    className={`pl-10 border-slate-200 ${!selectedCompanyId || availableBranches.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <SelectValue
                      placeholder={
                        !selectedCompanyId
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
                        value={String(branch.branch_id)}
                      >
                        {branch.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCompanyId && availableBranches.length === 0 && (
                <p className="text-xs text-amber-600">
                  No branches found for this company.
                </p>
              )}
            </div>

            {/* Department Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Department Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 border-slate-200"
                  required
                />
              </div>
            </div>

            {editingDepartment && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Department ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingDepartment.department_id}
                  </span>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                className="border-slate-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {editingDepartment ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Department
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Department
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
