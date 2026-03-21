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
  Car,
  Trash2,
  Pencil,
  User,
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
import { AssetVehiclesDialogProps, Vehicle } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

export default function AssetVehiclesDialog({
  open,
  onOpenChange,
  vehicles: initialVehicles = [],
  onVehiclesChange,
}: AssetVehiclesDialogProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Sync with external vehicles prop
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  // Form state
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    plate_number: "",
    car_type: "",
    owners_first_name: "",
    owners_last_name: "",
  });

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.car_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owners_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owners_last_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const updateVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    onVehiclesChange?.(newVehicles);
  };

  const handleRemove = async (vehicle_id: string) => {
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("vehicle_id", vehicle_id);

    if (error) {
      console.error("Error deleting vehicle:", error);
      return;
    }

    const newVehicles = vehicles.filter((v) => v.vehicle_id !== vehicle_id);
    updateVehicles(newVehicles);
  };

  const handleOpenForm = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        plate_number: "",
        car_type: "",
        owners_first_name: "",
        owners_last_name: "",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingVehicle(null);
    setFormData({
      plate_number: "",
      car_type: "",
      owners_first_name: "",
      owners_last_name: "",
    });
  };

  async function createAssetVehicle({
    plate_number,
    car_type,
    owners_first_name,
    owners_last_name,
  }: Vehicle) {
    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        plate_number,
        car_type,
        owners_first_name,
        owners_last_name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating vehicle:", error);
      return;
    }

    const newVehicles = [...vehicles, data];
    updateVehicles(newVehicles);
  }

  async function updateAssetVehicle({
    plate_number,
    car_type,
    owners_first_name,
    owners_last_name,
  }: Vehicle) {
    if (!editingVehicle) return;

    const { data, error } = await supabase
      .from("vehicles")
      .update({
        plate_number,
        car_type,
        owners_first_name,
        owners_last_name,
      })
      .eq("vehicle_id", editingVehicle.vehicle_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating vehicle:", error);
      return;
    }

    const newVehicles = vehicles.map((v) =>
      v.vehicle_id === editingVehicle.vehicle_id ? data : v,
    );

    updateVehicles(newVehicles);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.plate_number ||
      !formData.car_type ||
      !formData.owners_first_name ||
      !formData.owners_last_name
    )
      return;

    if (editingVehicle) {
      await updateAssetVehicle(formData as Vehicle);
    } else {
      await createAssetVehicle(formData as Vehicle);
    }

    handleCloseForm();
  };

  const getTypeColor = (car_type: string) => {
    switch (car_type) {
      case "Company":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Partner":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Rental":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getOwnerFullName = (vehicle: Vehicle) => {
    return `${vehicle.owners_first_name} ${vehicle.owners_last_name}`.trim();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-amber-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-amber-600">
              <div className="p-2 rounded-lg bg-amber-50">
                <Car className="w-6 h-6 text-amber-600" />
              </div>
              Asset Vehicles
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Track and manage company or partner vehicles registered as assets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-amber-600 focus:ring-amber-600/20"
                />
              </div>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>

            {/* Vehicles Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Vehicle Assets
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">
                        {vehicles.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Company, partner, and rental vehicles
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-amber-600 font-semibold">
                        Vehicle ID
                      </TableHead>
                      <TableHead className="text-amber-600 font-semibold">
                        Plate Number
                      </TableHead>
                      <TableHead className="text-amber-600 font-semibold">
                        Car Type
                      </TableHead>
                      <TableHead className="text-amber-600 font-semibold">
                        Owner
                      </TableHead>
                      <TableHead className="w-[100px] text-amber-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Car className="w-8 h-8 text-slate-300" />
                            <p>No vehicles found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow
                          key={vehicle.vehicle_id}
                          className="hover:bg-amber-50/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-mono font-medium text-amber-600">
                              {vehicle.vehicle_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-amber-600 border-amber-300"
                            >
                              {vehicle.plate_number}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getTypeColor(vehicle.car_type)}
                            >
                              {vehicle.car_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                <User className="w-4 h-4" />
                              </div>
                              <span className="text-slate-900">
                                {getOwnerFullName(vehicle)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-amber-100 hover:text-amber-600"
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
                                  className="text-slate-700 cursor-pointer hover:bg-amber-50 hover:text-amber-600"
                                  onClick={() => handleOpenForm(vehicle)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-amber-600" />
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() =>
                                    handleRemove(vehicle.vehicle_id)
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

      {/* Add/Edit Vehicle Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 border-t-4 border-t-amber-600">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-amber-600">
              <div className="p-2 rounded-lg bg-amber-50">
                {editingVehicle ? (
                  <Pencil className="w-5 h-5 text-amber-600" />
                ) : (
                  <Plus className="w-5 h-5 text-amber-600" />
                )}
              </div>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingVehicle
                ? "Update the vehicle details below."
                : "Fill in the details to register a new vehicle."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="plate_number" className="text-slate-700">
                Plate Number
              </Label>
              <Input
                id="plate_number"
                placeholder="e.g., ABC-1234"
                value={formData.plate_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    plate_number: e.target.value,
                  }))
                }
                className="border-slate-200 focus:border-amber-600 focus:ring-amber-600/20 font-mono uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="car_type" className="text-slate-700">
                Car Type
              </Label>
              <Input
                id="car_type"
                placeholder="e.g., Company, Partner, Rental"
                value={formData.car_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    car_type: e.target.value,
                  }))
                }
                className="border-slate-200 focus:border-amber-600 focus:ring-amber-600/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owners_first_name" className="text-slate-700">
                  Owner's First Name
                </Label>
                <Input
                  id="owners_first_name"
                  placeholder="e.g., John"
                  value={formData.owners_first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      owners_first_name: e.target.value,
                    }))
                  }
                  className="border-slate-200 focus:border-amber-600 focus:ring-amber-600/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owners_last_name" className="text-slate-700">
                  Owner's Last Name
                </Label>
                <Input
                  id="owners_last_name"
                  placeholder="e.g., Doe"
                  value={formData.owners_last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      owners_last_name: e.target.value,
                    }))
                  }
                  className="border-slate-200 focus:border-amber-600 focus:ring-amber-600/20"
                  required
                />
              </div>
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
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {editingVehicle ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Vehicle
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
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
