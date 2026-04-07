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
  MapPin,
  Trash2,
  Eye,
  Pencil,
  X,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Branch, Company } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface BranchSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  companies: Company[]; // Passed from parent/page
}

export default function BranchSettingsDialog({
  open,
  onOpenChange,
  branches: initialBranches,
  companies,
}: BranchSettingsDialogProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form state - only location and company_id
  const [location, setLocation] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  // Filter branches based on search
  const filteredBranches = branches.filter(
    (b) =>
      b.location.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.branch_id.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  );

  async function createBranch(
    location: string,
    company_id: string,
  ): Promise<Branch | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("branches")
      .insert([{ location, company_id }])
      .select()
      .single();

    if (error) {
      console.log("Error creating branch:", error);
      toast.error("Failed to create branch", {
        description: "An error occurred while creating the branch.",
      });
      return null;
    }

    toast.success("Branch created successfully", {
      description: `${location} has been added.`,
    });

    return data;
  }

  async function updateBranch(
    branch_id: string,
    location: string,
    company_id: string,
    previousLocation?: string,
  ): Promise<Branch> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("branches")
      .update({ location, company_id })
      .eq("branch_id", branch_id)
      .select()
      .single();

    if (error) {
      console.log("Error updating branch:", error);
      toast.error("Failed to update branch", {
        description: "An error occurred while updating the branch.",
      });
    }

    const locationChanged = previousLocation && previousLocation !== location;
    toast.success("Branch updated successfully", {
      description: locationChanged
        ? `${previousLocation} has been renamed to ${location}.`
        : `${location} has been updated.`,
    });

    return data;
  }

  // Get company name for display
  const getCompanyName = (companies?: Company) => {
    return companies?.name || "Unknown";
  };

  const handleRemove = async (id: string) => {
    const supabase = createClient();

    // Find branch details before deletion for toast message
    const branchToDelete = branches.find((b) => b.branch_id === id);
    const branchLocation = branchToDelete?.location || "Branch";

    try {
      const { error } = await supabase
        .from("branches")
        .delete()
        .eq("branch_id", id);

      if (error) {
        console.log("Error deleting branch:", error);
        toast.error("Failed to delete branch", {
          description: "An error occurred while deleting the branch.",
        });
        return;
      }

      setBranches((prev) => prev.filter((b) => b.branch_id !== id));

      toast.success("Branch deleted successfully", {
        description: `${branchLocation} has been removed.`,
      });
    } catch (err: any) {
      console.log("Unexpected error deleting branch:", err);
      toast.error("Failed to delete branch", {
        description: "An unexpected error occurred.",
      });
    }
  };

  const handleOpenForm = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setLocation(branch.location);
      setSelectedCompanyId(branch.company?.company_id || "");
    } else {
      setEditingBranch(null);
      setLocation("");
      setSelectedCompanyId("");
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingBranch(null);
    setLocation("");
    setSelectedCompanyId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim() || !selectedCompanyId) return;

    try {
      let updatedBranch: Branch;

      if (editingBranch) {
        updatedBranch = await updateBranch(
          editingBranch.branch_id,
          location,
          selectedCompanyId,
        );

        setBranches((prev) =>
          prev.map((b) =>
            b.branch_id === updatedBranch.branch_id ? updatedBranch : b,
          ),
        );
      } else {
        const newBranch = await createBranch(location, selectedCompanyId);
        if (!newBranch) return;
        updatedBranch = newBranch;
        setBranches((prev) => [...prev, updatedBranch]);
      }

      handleCloseForm();
    } catch (err) {
      console.error("Failed to save branch:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-150 lg:max-w-200 w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                <MapPin className="w-6 h-6 text-[#2B3A9F]" />
              </div>
              Branch Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage office locations and assign them to companies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
                <Input
                  placeholder="Search branches..."
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
                Create Branch
              </Button>
            </div>

            {/* Branches Table */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      Office Locations
                      <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                        {branches.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Active branches and their assigned companies
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Branch Location
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Company
                      </TableHead>
                      <TableHead className="w-25 text-[#2B3A9F] font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranches.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-slate-400 py-12"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <MapPin className="w-8 h-8 text-slate-300" />
                            <p>No branches found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBranches.map((branch) => (
                        <TableRow
                          key={branch.branch_id}
                          className="hover:bg-[#2B3A9F]/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F]">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {branch.location}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ID: {branch.branch_id}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-700">
                              {getCompanyName(branch.company)}
                            </span>
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
                                  onClick={() => handleOpenForm(branch)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  Edit Branch
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(branch.branch_id)}
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

      {/* Add/Edit Branch Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-112.5 p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                {editingBranch ? (
                  <Pencil className="w-5 h-5 text-[#2B3A9F]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#2B3A9F]" />
                )}
              </div>
              {editingBranch ? "Edit Branch" : "Create New Branch"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingBranch
                ? "Update the branch location and company assignment."
                : "Enter the branch location and select a company."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Location Input */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-700">
                Branch Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="location"
                  placeholder="e.g., Bajada, Davao City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            {/* Company Select */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-700">
                Company
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem
                        key={company.company_id}
                        value={company.company_id}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingBranch && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Branch ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingBranch.branch_id}
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
                disabled={!location.trim() || !selectedCompanyId}
              >
                {editingBranch ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Branch
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Branch
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
