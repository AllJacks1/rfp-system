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
  Shapes,
  Trash2,
  Eye,
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
import React, { useState } from "react";

interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: "Weight" | "Volume" | "Length" | "Area" | "Quantity" | "Time";
  description: string;
  status: "active" | "inactive";
}

const mockUnits: Unit[] = [
  {
    id: "1",
    name: "Kilogram",
    symbol: "kg",
    category: "Weight",
    description: "Metric unit of mass",
    status: "active",
  },
  {
    id: "2",
    name: "Piece",
    symbol: "pc",
    category: "Quantity",
    description: "Individual item count",
    status: "active",
  },
  {
    id: "3",
    name: "Liter",
    symbol: "L",
    category: "Volume",
    description: "Metric unit of volume",
    status: "active",
  },
  {
    id: "4",
    name: "Meter",
    symbol: "m",
    category: "Length",
    description: "Metric unit of length",
    status: "active",
  },
  {
    id: "5",
    name: "Square Meter",
    symbol: "m²",
    category: "Area",
    description: "Metric unit of area",
    status: "active",
  },
  {
    id: "6",
    name: "Hour",
    symbol: "hr",
    category: "Time",
    description: "Unit of time",
    status: "inactive",
  },
];

interface UnitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UnitsDialog({ open, onOpenChange }: UnitsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Unit>>({
    name: "",
    symbol: "",
    category: "Weight",
    description: "",
  });

  const activeUnits = units.filter((u) => u.status === "active");
  const filteredUnits = activeUnits.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const handleOpenForm = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData(unit);
    } else {
      setEditingUnit(null);
      setFormData({
        name: "",
        symbol: "",
        category: "Weight",
        description: "",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUnit(null);
    setFormData({
      name: "",
      symbol: "",
      category: "Weight",
      description: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUnit) {
      // Update existing
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id ? { ...u, ...(formData as Unit) } : u
        )
      );
    } else {
      // Create new
      const newUnit: Unit = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "",
        symbol: formData.symbol || "",
        category: (formData.category as Unit["category"]) || "Weight",
        description: formData.description || "",
        status: "active",
      };
      setUnits((prev) => [...prev, newUnit]);
    }

    handleCloseForm();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Weight: "bg-sky-100 text-sky-700 border-sky-200",
      Volume: "bg-blue-100 text-blue-700 border-blue-200",
      Length: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Area: "bg-violet-100 text-violet-700 border-violet-200",
      Quantity: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Time: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[category] || "bg-slate-100 text-slate-700";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] lg:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-sky-600">
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
                        {activeUnits.length}
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
                        Unit Name
                      </TableHead>
                      <TableHead className="text-sky-600 font-semibold">
                        Symbol
                      </TableHead>
                      <TableHead className="text-sky-600 font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-sky-600 font-semibold">
                        Description
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
                          colSpan={5}
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
                          key={unit.id}
                          className="hover:bg-sky-50/50 transition-colors"
                        >
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
                            <Badge
                              variant="outline"
                              className="font-mono text-sky-600 border-sky-300"
                            >
                              {unit.symbol}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getCategoryColor(unit.category)}
                            >
                              {unit.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {unit.description}
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
                                <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-sky-50 hover:text-sky-600">
                                  <Eye className="w-4 h-4 mr-2 text-sky-600" />
                                  View Details
                                </DropdownMenuItem>
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
                                  onClick={() => handleRemove(unit.id)}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Unit Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Kilogram"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="border-slate-200 focus:border-sky-600 focus:ring-sky-600/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol" className="text-slate-700">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  placeholder="e.g., kg"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, symbol: e.target.value }))
                  }
                  className="border-slate-200 focus:border-sky-600 focus:ring-sky-600/20 font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as Unit["category"],
                  }))
                }
              >
                <SelectTrigger className="border-slate-200 focus:border-sky-600 focus:ring-sky-600/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weight">Weight</SelectItem>
                  <SelectItem value="Volume">Volume</SelectItem>
                  <SelectItem value="Length">Length</SelectItem>
                  <SelectItem value="Area">Area</SelectItem>
                  <SelectItem value="Quantity">Quantity</SelectItem>
                  <SelectItem value="Time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Brief description of this unit..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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