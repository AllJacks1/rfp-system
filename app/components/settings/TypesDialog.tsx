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
  Shapes,
  Trash2,
  Eye,
  Pencil,
  Tag,
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

interface Type {
  id: string;
  name: string;
  category: "Service" | "Purchase" | "Product";
  description: string;
  usage: number;
  status: "active" | "inactive";
}

const mockTypes: Type[] = [
  {
    id: "1",
    name: "Consulting",
    category: "Service",
    description: "Professional consulting services",
    usage: 156,
    status: "active",
  },
  {
    id: "2",
    name: "Software License",
    category: "Purchase",
    description: "Software and digital licenses",
    usage: 89,
    status: "active",
  },
  {
    id: "3",
    name: "Hardware",
    category: "Product",
    description: "Physical equipment and devices",
    usage: 234,
    status: "active",
  },
  {
    id: "4",
    name: "Maintenance",
    category: "Service",
    description: "Repair and maintenance services",
    usage: 67,
    status: "active",
  },
  {
    id: "5",
    name: "Training",
    category: "Service",
    description: "Employee training programs",
    usage: 45,
    status: "inactive",
  },
];

interface TypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TypesDialog({ open, onOpenChange }: TypesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [types, setTypes] = useState<Type[]>(mockTypes);

  const activeTypes = types.filter((t) => t.status === "active");
  const filteredTypes = activeTypes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemove = (id: string) => {
    setTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Service":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Purchase":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Product":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-blue-600">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-blue-600">
            <div className="p-2 rounded-lg bg-blue-50">
              <Shapes className="w-6 h-6 text-blue-600" />
            </div>
            Types
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Manage service categories and purchase types used in transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Type
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Transaction Types
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                      {activeTypes.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Service categories and purchase classifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-blue-600 font-semibold">
                      Type Name
                    </TableHead>
                    <TableHead className="text-blue-600 font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-blue-600 font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-blue-600 font-semibold">
                      Usage
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
                        colSpan={5}
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
                        key={type.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
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
                          <Badge
                            variant="outline"
                            className={getCategoryColor(type.category)}
                          >
                            {type.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-xs truncate">
                          {type.description}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-100 text-slate-700 border-0">
                            {type.usage} transactions
                          </Badge>
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
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600">
                                <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600">
                                <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                                Edit Type
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(type.id)}
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
