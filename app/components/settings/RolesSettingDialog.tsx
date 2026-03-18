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
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Eye,
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
import React, { useState, useMemo, useCallback } from "react";
import { Role, RolesSettingsDialogProps } from "@/lib/interfaces";

const THEME_COLOR = "#2B3A9F";

export default function RolesSettingsDialog({
  open,
  onOpenChange,
  roles: initialRoles,
}: RolesSettingsDialogProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState("");

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roles) return [];

    const query = searchQuery.toLowerCase().trim();

    return roles.filter(
      (r) =>
        r.name?.toString().toLowerCase().includes(query) ||
        r.role_id?.toString().toLowerCase().includes(query)
    );
  }, [roles, searchQuery]);

  const activeCount = useMemo(() => roles.length, [roles]);

  const handleRemove = useCallback((id: string) => {
    setRoles((prev) => prev.filter((r) => r.role_id !== id));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingRole(null);
    setName("");
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingRole(null);
    setName("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      if (editingRole) {
        setRoles((prev) =>
          prev.map((r) =>
            r.role_id === editingRole.role_id
              ? { ...r, name }
              : r
          )
        );
      } else {
        const newRole: Role = {
          role_id: Math.random().toString(36).substr(2, 9),
          name,
        };
        setRoles((prev) => [...prev, newRole]);
      }

      handleCloseForm();
    },
    [editingRole, name, handleCloseForm]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

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
                <ShieldCheck className="w-6 h-6" style={{ color: THEME_COLOR }} />
              </div>
              Roles Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Define roles for employees.
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
                      Active roles
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
                        Role Name
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
                          colSpan={2}
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
                        <TableRow
                          key={role.role_id}
                          className="transition-colors hover:bg-opacity-5"
                          style={{
                            ["--hover-bg" as string]: `${THEME_COLOR}10`,
                          }}
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
                                  ID: {role.role_id}
                                </span>
                              </div>
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
                                  <Eye className="w-4 h-4 mr-2" style={{ color: THEME_COLOR }} />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleOpenEdit(role)}
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
                                  onClick={() => handleRemove(role.role_id)}
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

      {/* Create/Edit Role Form Dialog */}
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
                {editingRole ? (
                  <Pencil className="w-5 h-5" style={{ color: THEME_COLOR }} />
                ) : (
                  <ShieldCheck className="w-5 h-5" style={{ color: THEME_COLOR }} />
                )}
              </div>
              {editingRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingRole
                ? "Update the role name."
                : "Enter a name for the new role."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Manager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 border-slate-200"
                  required
                />
              </div>
            </div>

            {editingRole && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Role ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingRole.role_id}
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
                {editingRole ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Role
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
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