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
  Building2,
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
import React, { useState, useEffect } from "react";
import { Company, CompanySettingsDialogProps } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";

export default function CompanySettingsDialog({
  open,
  onOpenChange,
  companies: initialCompanies,
}: CompanySettingsDialogProps) {
  // Local state for companies (since we need to modify the list)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form state - only name since that's what the database stores
  const [companyName, setCompanyName] = useState("");

  // Sync with props when they change
  useEffect(() => {
    setCompanies(initialCompanies);
  }, [initialCompanies]);

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company_id.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  );

  async function createCompany(companyName: string): Promise<Company> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("companies")
      .insert([{ name: companyName }])
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function updateCompany(
    companyId: string,
    companyName: string,
  ): Promise<Company> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("companies")
      .update({ name: companyName })
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const handleRemove = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.company_id !== id));
  };

  const handleOpenForm = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setCompanyName(company.name);
    } else {
      setEditingCompany(null);
      setCompanyName("");
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCompany(null);
    setCompanyName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedCompany: Company;

      if (editingCompany) {
        // 🔄 Update in DB (you should have this function)
        updatedCompany = await updateCompany(
          editingCompany.company_id,
          companyName,
        );

        // 🧠 Sync local state
        setCompanies((prev) =>
          prev.map((c) =>
            c.company_id === updatedCompany.company_id ? updatedCompany : c,
          ),
        );
      } else {
        updatedCompany = await createCompany(companyName);

        // 🧠 Sync local state
        setCompanies((prev) => [...prev, updatedCompany]);
      }

      handleCloseForm();
    } catch (err) {
      console.error("Failed to save company:", err);
    }
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
        <DialogContent className="sm:max-w-150 lg:max-w-200 w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
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
                        {companies.length}
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
                      <TableHead className="text-[#2B3A9F] font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
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
                          key={company.company_id}
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
                                  ID: {company.company_id}
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
                                  onClick={() =>
                                    handleRemove(company.company_id)
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

      {/* Add/Edit Company Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-112.5 p-6 border-t-4 border-t-[#2B3A9F]">
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
                ? "Update the company name below."
                : "Enter a name for the new company."}
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
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            {editingCompany && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Company ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingCompany.company_id}
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
                disabled={!companyName.trim()}
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
