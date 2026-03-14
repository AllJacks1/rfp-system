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
import {
  MoreHorizontal,
  Plus,
  Search,
  Car,
  Trash2,
  Eye,
  Pencil,
  Gauge,
  Calendar,
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

interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: "Company" | "Partner" | "Rental";
  model: string;
  year: number;
  mileage: number;
  status: "active" | "maintenance" | "inactive";
  assignedTo: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Hilux",
    plateNumber: "ABC-1234",
    type: "Company",
    model: "Hilux 4x4",
    year: 2022,
    mileage: 45000,
    status: "active",
    assignedTo: "John Driver",
  },
  {
    id: "2",
    name: "Ford Ranger",
    plateNumber: "XYZ-5678",
    type: "Company",
    model: "Ranger XLT",
    year: 2023,
    mileage: 23000,
    status: "active",
    assignedTo: "Mike Smith",
  },
  {
    id: "3",
    name: "Mitsubishi L300",
    plateNumber: "DEF-9012",
    type: "Partner",
    model: "L300 Van",
    year: 2021,
    mileage: 78000,
    status: "maintenance",
    assignedTo: "Partner A",
  },
  {
    id: "4",
    name: "Isuzu D-Max",
    plateNumber: "GHI-3456",
    type: "Rental",
    model: "D-Max LS",
    year: 2023,
    mileage: 12000,
    status: "active",
    assignedTo: "Rental Co.",
  },
];

interface AssetVehiclesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssetVehiclesDialog({
  open,
  onOpenChange,
}: AssetVehiclesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

  const activeVehicles = vehicles.filter((v) => v.status !== "inactive");
  const filteredVehicles = activeVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemove = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-0";
      case "maintenance":
        return "bg-amber-100 text-amber-700 border-0";
      case "inactive":
        return "bg-slate-100 text-slate-600 border-0";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-amber-600">
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
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Vehicle Assets
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">
                      {activeVehicles.length}
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
                      Vehicle
                    </TableHead>
                    <TableHead className="text-amber-600 font-semibold">
                      Plate Number
                    </TableHead>
                    <TableHead className="text-amber-600 font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-amber-600 font-semibold">
                      Year/Model
                    </TableHead>
                    <TableHead className="text-amber-600 font-semibold">
                      Mileage
                    </TableHead>
                    <TableHead className="text-amber-600 font-semibold">
                      Status
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
                        colSpan={7}
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
                        key={vehicle.id}
                        className="hover:bg-amber-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                              <Car className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {vehicle.name}
                              </span>
                              <span className="text-xs text-slate-500">
                                Assigned: {vehicle.assignedTo}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-amber-600 border-amber-300"
                          >
                            {vehicle.plateNumber}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getTypeColor(vehicle.type)}
                          >
                            {vehicle.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {vehicle.year} • {vehicle.model}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-slate-400" />
                            {vehicle.mileage.toLocaleString()} km
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
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
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-amber-50 hover:text-amber-600">
                                <Eye className="w-4 h-4 mr-2 text-amber-600" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-amber-50 hover:text-amber-600">
                                <Pencil className="w-4 h-4 mr-2 text-amber-600" />
                                Edit Vehicle
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(vehicle.id)}
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
  );
}
