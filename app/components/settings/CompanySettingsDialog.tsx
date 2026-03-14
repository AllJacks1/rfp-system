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
  Building2,
  Trash2,
  Eye,
  Pencil,
  X,
  MapPin,
  Users,
  Briefcase,
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

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  employees: number;
  status: "active" | "inactive";
  createdAt: string;
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Acme Corporation",
    industry: "Technology",
    location: "New York, NY",
    employees: 250,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Globex Industries",
    industry: "Manufacturing",
    location: "Chicago, IL",
    employees: 1200,
    status: "active",
    createdAt: "2022-08-22",
  },
  {
    id: "3",
    name: "Soylent Corp",
    industry: "Food & Beverage",
    location: "Los Angeles, CA",
    employees: 85,
    status: "inactive",
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    name: "Initech LLC",
    industry: "Software",
    location: "Austin, TX",
    employees: 45,
    status: "active",
    createdAt: "2023-11-03",
  },
];

const industryOptions = [
  "Technology",
  "Manufacturing",
  "Food & Beverage",
  "Software",
  "Healthcare",
  "Finance",
  "Retail",
  "Construction",
  "Education",
  "Other",
];

interface CompanySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompanySettingsDialog({
  open,
  onOpenChange,
}: CompanySettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    industry: "",
    location: "",
    employees: 0,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const activeCompanies = companies.filter((c) => c.status === "active");
  const filteredCompanies = activeCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const handleOpenForm = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        name: "",
        industry: "",
        location: "",
        employees: 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCompany(null);
    setFormData({
      name: "",
      industry: "",
      location: "",
      employees: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCompany) {
      // Update existing
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id ? { ...c, ...(formData as Company) } : c
        )
      );
    } else {
      // Create new
      const newCompany: Company = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "",
        industry: formData.industry || "Other",
        location: formData.location || "",
        employees: formData.employees || 0,
        status: "active",
        createdAt: formData.createdAt || new Date().toISOString().split("T")[0],
      };
      setCompanies((prev) => [...prev, newCompany]);
    }

    handleCloseForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                <Building2 className="w-6 h-6 text-[#2B3A9F]" />
              </div>
              Company Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage your organizations, view details, and configure company
              settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                />
              </div>
              <Button
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Company
              </Button>
            </div>

            {/* Companies Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Companies
                      <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                        {activeCompanies.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Active organizations in your system
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Company
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Industry
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Location
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Employees
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Created
                      </TableHead>
                      <TableHead className="w-[100px] text-[#2B3A9F] font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Building2 className="w-8 h-8 text-slate-300" />
                            <p>No companies found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow
                          key={company.id}
                          className="hover:bg-[#2B3A9F]/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F] font-bold text-sm">
                                {getInitials(company.name)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {company.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ID: {company.id}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-[#2B3A9F]/30 text-[#2B3A9F]"
                            >
                              {company.industry}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {company.location}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {company.employees.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {formatDate(company.createdAt)}
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
                                <DropdownMenuItem
                                  className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]"
                                  onClick={() => handleOpenForm(company)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  Edit Company
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(company.id)}
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

      {/* Add/Edit Company Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                {editingCompany ? (
                  <Pencil className="w-5 h-5 text-[#2B3A9F]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#2B3A9F]" />
                )}
              </div>
              {editingCompany ? "Edit Company" : "Create New Company"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingCompany
                ? "Update the company details below."
                : "Fill in the details to register a new organization."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Acme Corporation"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-slate-700">
                Industry
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-700">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employees" className="text-slate-700">
                  Employees
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="employees"
                    type="number"
                    placeholder="0"
                    value={formData.employees}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employees: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdAt" className="text-slate-700">
                  Created Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="createdAt"
                    type="date"
                    value={formData.createdAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        createdAt: e.target.value,
                      }))
                    }
                    className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {editingCompany && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Company ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingCompany.id}
                  </span>
                </div>
              </div>
            )}

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
                className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
              >
                {editingCompany ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Company
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company
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