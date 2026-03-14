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
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Trash2,
  Eye,
  Pencil,
  UserCircle,
  Building2,
  DollarSign,
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
import React, { useState, useMemo, useCallback } from "react";

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

type DepartmentStatus = "active" | "inactive";

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  employees: number;
  budget: string;
  description: string;
  status: DepartmentStatus;
}

interface DepartmentFormData {
  name: string;
  code: string;
  head: string;
  budget: string;
  description: string;
}

interface DepartmentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ───────────────────────────────────────────────────────────────
// Constants & Mock Data
// ───────────────────────────────────────────────────────────────

const THEME_COLOR = "#2B3A9F";

const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "1",
    name: "Engineering",
    code: "ENG",
    head: "Michael Chen",
    employees: 45,
    budget: "$2.5M",
    description: "Software development and IT infrastructure",
    status: "active",
  },
  {
    id: "2",
    name: "Marketing",
    code: "MKT",
    head: "Emily Davis",
    employees: 18,
    budget: "$1.2M",
    description: "Brand management and digital marketing",
    status: "active",
  },
  {
    id: "3",
    name: "Sales",
    code: "SAL",
    head: "Robert Taylor",
    employees: 32,
    budget: "$800K",
    description: "Business development and client relations",
    status: "active",
  },
  {
    id: "4",
    name: "Human Resources",
    code: "HR",
    head: "Amanda Wilson",
    employees: 8,
    budget: "$400K",
    description: "Talent acquisition and employee relations",
    status: "active",
  },
  {
    id: "5",
    name: "Finance",
    code: "FIN",
    head: "David Brown",
    employees: 12,
    budget: "$600K",
    description: "Accounting and financial planning",
    status: "inactive",
  },
];

// ───────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────

export default function DepartmentSettingsDialog({
  open,
  onOpenChange,
}: DepartmentSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Filter active departments and apply search
  const filteredDepartments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const activeDepts = departments.filter((d) => d.status === "active");

    if (!query) return activeDepts;

    return activeDepts.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.head.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
    );
  }, [departments, searchQuery]);

  const activeCount = useMemo(
    () => departments.filter((d) => d.status === "active").length,
    [departments]
  );

  const handleRemove = useCallback((id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((dept: Department) => {
    setEditingDepartment(dept);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingDepartment(null);
  }, []);

  const handleSaveDepartment = useCallback(
    (formData: DepartmentFormData) => {
      if (editingDepartment) {
        // Update existing
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === editingDepartment.id
              ? {
                  ...d,
                  ...formData,
                }
              : d
          )
        );
      } else {
        // Create new
        const newDepartment: Department = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          employees: 0,
          status: "active",
        };
        setDepartments((prev) => [...prev, newDepartment]);
      }
      handleCloseForm();
    },
    [editingDepartment, handleCloseForm]
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
                          borderColor: `${THEME_COLOR}30`
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
                        className="font-semibold w-[100px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Code
                      </TableHead>
                      <TableHead 
                        className="font-semibold"
                        style={{ color: THEME_COLOR }}
                      >
                        Department Head
                      </TableHead>
                      <TableHead 
                        className="font-semibold w-[120px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Employees
                      </TableHead>
                      <TableHead 
                        className="font-semibold w-[120px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Budget
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
                          colSpan={6}
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
                        <DepartmentRow
                          key={dept.id}
                          department={dept}
                          onRemove={handleRemove}
                          onEdit={handleOpenEdit}
                        />
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
      <DepartmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingDepartment={editingDepartment}
        onSave={handleSaveDepartment}
        onCancel={handleCloseForm}
      />
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────────

interface DepartmentRowProps {
  department: Department;
  onRemove: (id: string) => void;
  onEdit: (dept: Department) => void;
}

function DepartmentRow({ department, onRemove, onEdit }: DepartmentRowProps) {
  return (
    <TableRow 
      className="transition-colors hover:bg-opacity-5"
      style={{ ["--hover-bg" as string]: `${THEME_COLOR}10` }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ 
              backgroundColor: `${THEME_COLOR}15`, 
              color: THEME_COLOR 
            }}
          >
            {department.code}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-slate-900 truncate">
              {department.name}
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[200px]">
              {department.description}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="font-mono"
          style={{ 
            borderColor: `${THEME_COLOR}30`, 
            color: THEME_COLOR 
          }}
        >
          {department.code}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserCircle className="w-4 h-4" style={{ color: THEME_COLOR }} />
          <span className="text-slate-700 font-medium">
            {department.head}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-slate-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          {department.employees}
        </div>
      </TableCell>
      <TableCell className="text-slate-700 font-medium">
        {department.budget}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-opacity-10"
              style={{ ["--hover-bg" as string]: `${THEME_COLOR}15`, ["--hover-text" as string]: THEME_COLOR }}
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
              style={{ ["--hover-bg" as string]: `${THEME_COLOR}08`, ["--hover-color" as string]: THEME_COLOR }}
            >
              <Eye className="w-4 h-4 mr-2" style={{ color: THEME_COLOR }} />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onEdit(department)}
              style={{ ["--hover-bg" as string]: `${THEME_COLOR}08`, ["--hover-color" as string]: THEME_COLOR }}
            >
              <Pencil className="w-4 h-4 mr-2" style={{ color: THEME_COLOR }} />
              Edit Department
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
              onClick={() => onRemove(department.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// ───────────────────────────────────────────────────────────────
// Department Form Dialog Component
// ───────────────────────────────────────────────────────────────

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDepartment: Department | null;
  onSave: (data: DepartmentFormData) => void;
  onCancel: () => void;
}

function DepartmentFormDialog({
  open,
  onOpenChange,
  editingDepartment,
  onSave,
  onCancel,
}: DepartmentFormDialogProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    code: "",
    head: "",
    budget: "",
    description: "",
  });

  // Reset form when dialog opens/closes or editingDepartment changes
  React.useEffect(() => {
    if (open) {
      if (editingDepartment) {
        setFormData({
          name: editingDepartment.name,
          code: editingDepartment.code,
          head: editingDepartment.head,
          budget: editingDepartment.budget,
          description: editingDepartment.description,
        });
      } else {
        setFormData({
          name: "",
          code: "",
          head: "",
          budget: "",
          description: "",
        });
      }
    }
  }, [open, editingDepartment]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.code.trim()) return;
      onSave(formData);
    },
    [formData, onSave]
  );

  const isValid = formData.name.trim().length > 0 && formData.code.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Building2 className="w-5 h-5" style={{ color: THEME_COLOR }} />
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Department Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Engineering"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="pl-10 border-slate-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-700">
                Department Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., ENG"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ 
                    ...prev, 
                    code: e.target.value.toUpperCase() 
                  }))
                }
                className="border-slate-200 font-mono"
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="head" className="text-slate-700">
                Department Head
              </Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="head"
                  placeholder="e.g., John Smith"
                  value={formData.head}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, head: e.target.value }))
                  }
                  className="pl-10 border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-slate-700">
                Budget
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="budget"
                  placeholder="e.g., $1.5M"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, budget: e.target.value }))
                  }
                  className="pl-10 border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the department's responsibilities and focus areas..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="border-slate-200 min-h-[80px]"
            />
          </div>

          {editingDepartment && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Employees</span>
                <Badge
                  style={{ backgroundColor: `${THEME_COLOR}15`, color: THEME_COLOR, border: "none" }}
                >
                  <Users className="w-3 h-3 mr-1" />
                  {editingDepartment.employees}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
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
  );
}