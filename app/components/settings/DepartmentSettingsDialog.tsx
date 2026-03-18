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
import { Department, DepartmentSettingsDialogProps } from "@/lib/interfaces";

const THEME_COLOR = "#2B3A9F";

export default function DepartmentSettingsDialog({
  open,
  onOpenChange,
  departments: initialDepartments,
  branches,
}: DepartmentSettingsDialogProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!departments) return [];

    const query = searchQuery.toLowerCase().trim();

    return departments.filter(
      (d) =>
        d.name?.toLowerCase().includes(query) ||
        (d.branch_location || "").toLowerCase().includes(query) ||
        (d.branch_id || "").toLowerCase().includes(query) ||
        (d.company_id || "").toLowerCase().includes(query) ||
        (d.company_name || "").toLowerCase().includes(query)
    );
  }, [departments, searchQuery]);

  const activeCount = useMemo(() => departments.length, [departments]);

  const handleRemove = useCallback((id: string) => {
    setDepartments((prev) => prev.filter((d) => d.department_id !== id));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingDepartment(null);
    setName("");
    setSelectedBranchId("");
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((dept: Department) => {
    setEditingDepartment(dept);
    setName(dept.name);
    setSelectedBranchId(dept.branch_id || "");
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingDepartment(null);
    setName("");
    setSelectedBranchId("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      const selectedBranch = branches.find((b) => b.branch_id === selectedBranchId);

      if (editingDepartment) {
        setDepartments((prev) =>
          prev.map((d) =>
            d.department_id === editingDepartment.department_id
              ? {
                  ...d,
                  name,
                  branch_id: selectedBranchId,
                  branch_location: selectedBranch?.location,
                  company_id: selectedBranch?.company?.company_id,
                  company_name: selectedBranch?.company?.name || "",
                }
              : d
          )
        );
      } else {
        const newDepartment: Department = {
          department_id: Math.random().toString(36).substr(2, 9),
          name,
          branch_id: selectedBranchId,
          branch_location: selectedBranch?.location,
          company_id: selectedBranch?.company?.company_id,
          company_name: selectedBranch?.company?.name || "",
        };
        setDepartments((prev) => [...prev, newDepartment]);
      }

      handleCloseForm();
    },
    [editingDepartment, name, selectedBranchId, branches, handleCloseForm]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[950px] lg:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4"
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
                            <span className="text-slate-700">
                              {dept.company_name || "Unknown"}
                            </span>
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
                                  onClick={() => handleRemove(dept.department_id)}
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
                : "Fill in the details to create a new department."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-slate-700">
                Branch Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                >
                  <SelectTrigger className="pl-10 border-slate-200">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem
                        key={branch.branch_id}
                        value={branch.branch_id}
                      >
                        {branch.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={!name.trim()}
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