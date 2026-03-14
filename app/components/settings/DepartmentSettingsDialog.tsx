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
  Users,
  Trash2,
  Eye,
  Pencil,
  UserCircle,
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

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  employees: number;
  budget: string;
  description: string;
  status: "active" | "inactive";
}

const mockDepartments: Department[] = [
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

interface DepartmentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DepartmentSettingsDialog({
  open,
  onOpenChange,
}: DepartmentSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);

  const activeDepartments = departments.filter((d) => d.status === "active");
  const filteredDepartments = activeDepartments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemove = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-237.5 lg:max-w-300 w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
            <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
              <Users className="w-6 h-6 text-[#2B3A9F]" />
            </div>
            Department Settings
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Organize and manage departments, teams, and reporting structures.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
              />
            </div>
            <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Departments
                    <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                      {activeDepartments.length}
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
                    <TableHead className="text-[#2B3A9F] font-semibold">
                      Department
                    </TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">
                      Code
                    </TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">
                      Department Head
                    </TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">
                      Employees
                    </TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">
                      Budget
                    </TableHead>
                    <TableHead className="w-25 text-[#2B3A9F] font-semibold">
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
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p>No departments found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <TableRow
                        key={dept.id}
                        className="hover:bg-[#2B3A9F]/5 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F] font-bold text-sm">
                              {dept.code}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {dept.name}
                              </span>
                              <span className="text-xs text-slate-500 max-w-50 truncate">
                                {dept.description}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-[#2B3A9F]/30 text-[#2B3A9F] font-mono"
                          >
                            {dept.code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-[#2B3A9F]" />
                            <span className="text-slate-700 font-medium">
                              {dept.head}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            {dept.employees}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 font-medium">
                          {dept.budget}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-[#2B3A9F]/10 hover:text-[#2B3A9F]"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel className="text-xs text-slate-500">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                <Eye className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                Edit Department
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(dept.id)}
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
