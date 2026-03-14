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
import { Switch } from "@/components/ui/switch";
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
  ShieldCheck,
  Trash2,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Users,
  Lock,
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

type AccessLevel = "full" | "read" | "none";
type RoleStatus = "active" | "inactive";

interface Permission {
  module: string;
  access: AccessLevel;
}

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: Permission[];
  createdAt: string;
  isDefault: boolean;
  status: RoleStatus;
}

interface RoleFormData {
  name: string;
  description: string;
  isDefault: boolean;
  permissions: Permission[];
}

// ───────────────────────────────────────────────────────────────
// Constants & Mock Data
// ───────────────────────────────────────────────────────────────

const THEME_COLOR = "#2B3A9F";

const AVAILABLE_MODULES = [
  "Dashboard",
  "Users",
  "Roles",
  "Departments",
  "Reports",
  "Settings",
  "Content",
  "Billing",
  "Integrations",
];

const MOCK_ROLES: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access and configuration rights",
    users: 3,
    permissions: [{ module: "All Modules", access: "full" }],
    createdAt: "2023-01-01",
    isDefault: true,
    status: "active",
  },
  {
    id: "2",
    name: "Manager",
    description: "Department management and team oversight",
    users: 12,
    permissions: [
      { module: "Reports", access: "full" },
      { module: "Users", access: "full" },
      { module: "Settings", access: "read" },
    ],
    createdAt: "2023-02-15",
    isDefault: true,
    status: "active",
  },
  {
    id: "3",
    name: "Editor",
    description: "Content creation and modification rights",
    users: 28,
    permissions: [
      { module: "Content", access: "full" },
      { module: "Reports", access: "read" },
    ],
    createdAt: "2023-03-10",
    isDefault: false,
    status: "active",
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to assigned resources",
    users: 45,
    permissions: [{ module: "Reports", access: "read" }],
    createdAt: "2023-04-05",
    isDefault: true,
    status: "active",
  },
  {
    id: "5",
    name: "Guest",
    description: "Limited temporary access",
    users: 8,
    permissions: [{ module: "Content", access: "read" }],
    createdAt: "2023-06-20",
    isDefault: false,
    status: "inactive",
  },
];

// ───────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────

interface RolesSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RolesSettingsDialog({
  open,
  onOpenChange,
}: RolesSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Filter active roles and apply search
  const filteredRoles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const activeRoles = roles.filter((r) => r.status === "active");

    if (!query) return activeRoles;

    return activeRoles.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
  }, [roles, searchQuery]);

  const activeCount = useMemo(
    () => roles.filter((r) => r.status === "active").length,
    [roles]
  );

  const handleRemove = useCallback((id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingRole(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingRole(null);
  }, []);

  const handleSaveRole = useCallback(
    (formData: RoleFormData) => {
      if (editingRole) {
        // Update existing
        setRoles((prev) =>
          prev.map((r) =>
            r.id === editingRole.id
              ? {
                  ...r,
                  name: formData.name,
                  description: formData.description,
                  isDefault: formData.isDefault,
                  permissions: formData.permissions,
                }
              : r
          )
        );
      } else {
        // Create new
        const newRole: Role = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          description: formData.description,
          users: 0,
          permissions: formData.permissions,
          createdAt: new Date().toISOString(),
          isDefault: formData.isDefault,
          status: "active",
        };
        setRoles((prev) => [...prev, newRole]);
      }
      handleCloseForm();
    },
    [editingRole, handleCloseForm]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[950px] lg:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4"
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
                <ShieldCheck className="w-6 h-6" style={{ color: THEME_COLOR }} />
              </div>
              Roles Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Define roles, permissions, and access levels for employees.
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
                  placeholder="Search roles..."
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
                Create Role
              </Button>
            </div>

            {/* Roles Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Employee Roles
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
                      Active roles and permission sets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead
                        className="font-semibold w-[250px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Role Name
                      </TableHead>
                      <TableHead
                        className="font-semibold"
                        style={{ color: THEME_COLOR }}
                      >
                        Description
                      </TableHead>
                      <TableHead
                        className="font-semibold w-[100px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Users
                      </TableHead>
                      <TableHead
                        className="font-semibold w-[200px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Permissions
                      </TableHead>
                      <TableHead
                        className="font-semibold w-[100px]"
                        style={{ color: THEME_COLOR }}
                      >
                        Default
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
                    {filteredRoles.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <ShieldCheck className="w-10 h-10 text-slate-300" />
                            <p className="text-sm">
                              {searchQuery
                                ? "No roles match your search"
                                : "No roles found"}
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
                      filteredRoles.map((role) => (
                        <RoleRow
                          key={role.id}
                          role={role}
                          onRemove={handleRemove}
                          onEdit={handleOpenEdit}
                          formatDate={formatDate}
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

      {/* Create/Edit Role Form Dialog */}
      <RoleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingRole={editingRole}
        onSave={handleSaveRole}
        onCancel={handleCloseForm}
      />
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────────

interface RoleRowProps {
  role: Role;
  onRemove: (id: string) => void;
  onEdit: (role: Role) => void;
  formatDate: (date: string) => string;
}

function RoleRow({ role, onRemove, onEdit, formatDate }: RoleRowProps) {
  return (
    <TableRow
      className="transition-colors hover:bg-opacity-5"
      style={{ ["--hover-bg" as string]: `${THEME_COLOR}10` }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${THEME_COLOR}15`, color: THEME_COLOR }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{role.name}</span>
            <span className="text-xs text-slate-500">
              Created {formatDate(role.createdAt)}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-slate-600">
        <span className="truncate block max-w-[250px]">{role.description}</span>
      </TableCell>
      <TableCell>
        <Badge
          className="border-0"
          style={{ backgroundColor: `${THEME_COLOR}15`, color: THEME_COLOR }}
        >
          <Users className="w-3 h-3 mr-1" />
          {role.users}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {role.permissions.slice(0, 2).map((perm, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 truncate max-w-[100px]">
                {perm.module}:
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  perm.access === "full"
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                    : perm.access === "read"
                    ? "border-amber-300 text-amber-700 bg-amber-50"
                    : "border-slate-300 text-slate-600 bg-slate-50"
                }`}
              >
                {perm.access}
              </Badge>
            </div>
          ))}
          {role.permissions.length > 2 && (
            <span className="text-xs text-slate-400">
              +{role.permissions.length - 2} more
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {role.isDefault ? (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Yes</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">No</span>
          </div>
        )}
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
              <Eye className="w-4 h-4 mr-2" style={{ color: THEME_COLOR }} />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(role)}
              style={{
                ["--hover-bg" as string]: `${THEME_COLOR}08`,
                ["--hover-color" as string]: THEME_COLOR,
              }}
            >
              <Pencil className="w-4 h-4 mr-2" style={{ color: THEME_COLOR }} />
              Edit Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
              onClick={() => onRemove(role.id)}
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
// Role Form Dialog Component
// ───────────────────────────────────────────────────────────────

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: Role | null;
  onSave: (data: RoleFormData) => void;
  onCancel: () => void;
}

function RoleFormDialog({
  open,
  onOpenChange,
  editingRole,
  onSave,
  onCancel,
}: RoleFormDialogProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    isDefault: false,
    permissions: [],
  });

  // Reset form when dialog opens/closes or editingRole changes
  React.useEffect(() => {
    if (open) {
      if (editingRole) {
        setFormData({
          name: editingRole.name,
          description: editingRole.description,
          isDefault: editingRole.isDefault,
          permissions: [...editingRole.permissions],
        });
      } else {
        setFormData({
          name: "",
          description: "",
          isDefault: false,
          permissions: [],
        });
      }
    }
  }, [open, editingRole]);

  const handleAddPermission = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      permissions: [
        ...prev.permissions,
        { module: AVAILABLE_MODULES[0], access: "read" as AccessLevel },
      ],
    }));
  }, []);

  const handleRemovePermission = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((_, i) => i !== index),
    }));
  }, []);

  const handleUpdatePermission = useCallback(
    (index: number, field: keyof Permission, value: string) => {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.map((perm, i) =>
          i === index ? { ...perm, [field]: value } : perm
        ),
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) return;
      onSave(formData);
    },
    [formData, onSave]
  );

  const isValid = formData.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 border-t-4"
        style={{ borderTopColor: THEME_COLOR }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2">
            <DialogTitle 
              className="text-xl flex items-center gap-2"
              style={{ color: THEME_COLOR }}
            >
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${THEME_COLOR}15` }}
              >
                <Lock className="w-5 h-5" style={{ color: THEME_COLOR }} />
              </div>
              {editingRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingRole
                ? "Update role details and permissions."
                : "Define a new role with specific permissions and access levels."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Content Manager"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-slate-200"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the responsibilities and access level for this role..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border-slate-200 min-h-[80px]"
              />
            </div>

            {/* Default Role Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4 border-slate-200">
              <div className="space-y-0.5">
                <Label htmlFor="isDefault" className="text-base">
                  Set as Default Role
                </Label>
                <p className="text-sm text-slate-500">
                  New users will be assigned this role automatically
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isDefault: checked }))
                }
              />
            </div>

            {/* Permissions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Permissions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPermission}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Permission
                </Button>
              </div>

              {formData.permissions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    No permissions configured
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddPermission}
                    className="mt-2"
                  >
                    Add your first permission
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.permissions.map((perm, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                    >
                      <Select
                        value={perm.module}
                        onValueChange={(value) =>
                          handleUpdatePermission(index, "module", value)
                        }
                      >
                        <SelectTrigger className="w-[180px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODULES.map((mod) => (
                            <SelectItem key={mod} value={mod}>
                              {mod}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={perm.access}
                        onValueChange={(value) =>
                          handleUpdatePermission(index, "access", value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Access</SelectItem>
                          <SelectItem value="read">Read Only</SelectItem>
                          <SelectItem value="none">No Access</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleRemovePermission(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
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
              {editingRole ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}