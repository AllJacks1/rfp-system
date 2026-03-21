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
  Ruler,
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
import { Unit, UnitsDialogProps } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

export default function UnitsDialog({
  open,
  onOpenChange,
  units: initialUnits = [],
  onUnitsChange,
}: UnitsDialogProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitName, setUnitName] = useState("");

  // Sync with external units prop
  useEffect(() => {
    setUnits(initialUnits);
  }, [initialUnits]);

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.unit_id.includes(searchQuery),
  );

  const updateUnits = (newUnits: Unit[]) => {
    setUnits(newUnits);
    onUnitsChange?.(newUnits);
  };

  const handleRemove = async (unit_id: string) => {
    const { error } = await supabase
      .from("units")
      .delete()
      .eq("unit_id", unit_id);

    if (error) {
      console.error("Error deleting unit:", error);
      return;
    }

    const newUnits = units.filter((u) => u.unit_id !== unit_id);
    updateUnits(newUnits);
  };

  const handleOpenForm = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      setUnitName(unit.name);
    } else {
      setEditingUnit(null);
      setUnitName("");
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUnit(null);
    setUnitName("");
  };

  async function createUnit(name: string) {
    const { data, error } = await supabase
      .from("units")
      .insert({
        name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating unit:", error);
      return;
    }

    const newUnits = [...units, data];
    updateUnits(newUnits);
  }

  async function updateUnit(name: string) {
    if (!editingUnit) return;

    const { data, error } = await supabase
      .from("units")
      .update({ name })
      .eq("unit_id", editingUnit.unit_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating unit:", error);
      return;
    }

    const newUnits = units.map((u) =>
      u.unit_id === editingUnit.unit_id ? data : u,
    );

    updateUnits(newUnits);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unitName) return;

    if (editingUnit) {
      await updateUnit(unitName);
    } else {
      await createUnit(unitName);
    }

    handleCloseForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-sky-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-sky-600">
              <div className="p-2 rounded-lg bg-sky-50">
                <Shapes className="w-6 h-6 text-sky-600" />
              </div>
              Units
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage units of measurement used for products, services, and
              inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600" />
                <Input
                  placeholder="Search units..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-sky-600 focus:ring-sky-600/20"
                />
              </div>
              <Button
                className="bg-sky-600 hover:bg-sky-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Unit
              </Button>
            </div>

            {/* Units Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Measurement Units
                      <Badge className="bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200">
                        {units.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Units for inventory, products, and services
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-sky-600 font-semibold">
                        Unit ID
                      </TableHead>
                      <TableHead className="text-sky-600 font-semibold">
                        Unit Name
                      </TableHead>
                      <TableHead className="w-[100px] text-sky-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Ruler className="w-8 h-8 text-slate-300" />
                            <p>No units found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUnits.map((unit) => (
                        <TableRow
                          key={unit.unit_id}
                          className="hover:bg-sky-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-sky-600">
                              {unit.unit_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                <Ruler className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-slate-900">
                                {unit.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-sky-100 hover:text-sky-600"
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
                                  className="text-slate-700 cursor-pointer hover:bg-sky-50 hover:text-sky-600"
                                  onClick={() => handleOpenForm(unit)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-sky-600" />
                                  Edit Unit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(unit.unit_id)}
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

      {/* Add/Edit Unit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-sky-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-sky-600">
              <div className="p-2 rounded-lg bg-sky-50">
                {editingUnit ? (
                  <Pencil className="w-5 h-5 text-sky-600" />
                ) : (
                  <Plus className="w-5 h-5 text-sky-600" />
                )}
              </div>
              {editingUnit ? "Edit Unit" : "Add New Unit"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingUnit
                ? "Update the unit details below."
                : "Fill in the details to create a new measurement unit."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Unit Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Kilogram"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="border-slate-200 focus:border-sky-600 focus:ring-sky-600/20"
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
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                {editingUnit ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Unit
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Unit
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
