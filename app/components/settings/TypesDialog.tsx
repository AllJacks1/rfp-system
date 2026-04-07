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
  MoreHorizontal,
  Plus,
  Search,
  Shapes,
  Trash2,
  Pencil,
  Tag,
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
import { Type, TypesDialogProps } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function TypesDialog({
  open,
  onOpenChange,
  types: initialTypes = [],
  onTypesChange,
}: TypesDialogProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [types, setTypes] = useState<Type[]>(initialTypes);
  const [formOpen, setFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [typeName, setTypeName] = useState("");

  // Sync with external types prop
  useEffect(() => {
    setTypes(initialTypes);
  }, [initialTypes]);

  const filteredTypes = types.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type_id.includes(searchQuery),
  );

  const updateTypes = (newTypes: Type[]) => {
    setTypes(newTypes);
    onTypesChange?.(newTypes);
  };

  const handleRemove = async (type_id: string) => {
    // Find type details before deletion for the toast message
    const typeToDelete = types.find((t) => t.type_id === type_id);
    const typeName = typeToDelete?.name || "Type";

    const { error } = await supabase
      .from("types")
      .delete()
      .eq("type_id", type_id);

    if (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete type", {
        description:
          error.message || "An error occurred while deleting the type.",
      });
      return;
    }

    const newTypes = types.filter((t) => t.type_id !== type_id);
    updateTypes(newTypes);

    toast.success("Type deleted successfully", {
      description: `${typeName} has been removed.`,
    });
  };

  const handleOpenForm = (type?: Type) => {
    if (type) {
      setEditingType(type);
      setTypeName(type.name);
    } else {
      setEditingType(null);
      setTypeName("");
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingType(null);
    setTypeName("");
  };

  async function createType(name: string) {
    const { data, error } = await supabase
      .from("types")
      .insert({
        name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating type:", error);
      toast.error("Failed to create type", {
        description:
          error.message || "An error occurred while creating the type.",
      });
      return;
    }

    const newTypes = [...types, data];
    updateTypes(newTypes);

    toast.success("Type created successfully", {
      description: `${name} has been added.`,
    });
  }

  async function editType(name: string) {
    if (!editingType) return;

    const previousName = editingType.name;

    const { data, error } = await supabase
      .from("types")
      .update({ name })
      .eq("type_id", editingType.type_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating type:", error);
      toast.error("Failed to update type", {
        description:
          error.message || "An error occurred while updating the type.",
      });
      return;
    }

    const newTypes = types.map((t) =>
      t.type_id === editingType.type_id ? data : t,
    );

    updateTypes(newTypes);

    // Show different message if name was changed
    const nameChanged = previousName !== name;
    toast.success("Type updated successfully", {
      description: nameChanged
        ? `${previousName} has been renamed to ${name}.`
        : `${name} has been updated.`,
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!typeName) return;

    if (editingType) {
      await editType(typeName);
    } else {
      await createType(typeName);
    }

    handleCloseForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-blue-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-blue-600">
              <div className="p-2 rounded-lg bg-blue-50">
                <Shapes className="w-6 h-6 text-blue-600" />
              </div>
              Types
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage transaction types and categories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                <Input
                  placeholder="Search types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Type
              </Button>
            </div>

            {/* Types Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Transaction Types
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                        {types.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Available transaction type classifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-blue-600 font-semibold">
                        Type ID
                      </TableHead>
                      <TableHead className="text-blue-600 font-semibold">
                        Type Name
                      </TableHead>
                      <TableHead className="w-[100px] text-blue-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTypes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Shapes className="w-8 h-8 text-slate-300" />
                            <p>No types found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTypes.map((type) => (
                        <TableRow
                          key={type.type_id}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-blue-600">
                              {type.type_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Tag className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-slate-900">
                                {type.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-blue-100 hover:text-blue-600"
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
                                  className="text-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() => handleOpenForm(type)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                                  Edit Type
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(type.type_id)}
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

      {/* Add/Edit Type Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-blue-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-blue-600">
              <div className="p-2 rounded-lg bg-blue-50">
                {editingType ? (
                  <Pencil className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-blue-600" />
                )}
              </div>
              {editingType ? "Edit Type" : "Create New Type"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingType
                ? "Update the type details below."
                : "Fill in the details to create a new transaction type."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Type Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Consulting"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                required
              />
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingType ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Type
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Type
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
