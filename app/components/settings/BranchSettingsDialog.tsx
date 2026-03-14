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
  Phone,
  X,
  User,
  Building2,
  Globe,
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

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  manager: string;
  status: "active" | "inactive";
}

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Headquarters",
    address: "123 Main St, Suite 100",
    city: "New York",
    country: "USA",
    phone: "+1 (555) 123-4567",
    manager: "John Smith",
    status: "active",
  },
  {
    id: "2",
    name: "West Coast Office",
    address: "456 Market St, Floor 12",
    city: "San Francisco",
    country: "USA",
    phone: "+1 (555) 987-6543",
    manager: "Sarah Johnson",
    status: "active",
  },
  {
    id: "3",
    name: "London Branch",
    address: "789 Oxford Street",
    city: "London",
    country: "UK",
    phone: "+44 20 7123 4567",
    manager: "James Wilson",
    status: "active",
  },
  {
    id: "4",
    name: "Singapore Office",
    address: "101 Marina Bay",
    city: "Singapore",
    country: "Singapore",
    phone: "+65 6123 4567",
    manager: "Li Wei",
    status: "inactive",
  },
];

const countryOptions = [
  "USA",
  "UK",
  "Singapore",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "Other",
];

interface BranchSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BranchSettingsDialog({
  open,
  onOpenChange,
}: BranchSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: "",
    address: "",
    city: "",
    country: "USA",
    phone: "",
    manager: "",
    status: "active",
  });

  const activeBranches = branches.filter((b) => b.status === "active");
  const filteredBranches = activeBranches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleOpenForm = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData(branch);
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        country: "USA",
        phone: "",
        manager: "",
        status: "active",
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingBranch(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      country: "USA",
      phone: "",
      manager: "",
      status: "active",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBranch) {
      // Update existing
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id ? { ...b, ...(formData as Branch) } : b
        )
      );
    } else {
      // Create new
      const newBranch: Branch = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "",
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "USA",
        phone: formData.phone || "",
        manager: formData.manager || "",
        status: "active",
      };
      setBranches((prev) => [...prev, newBranch]);
    }

    handleCloseForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[950px] lg:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
              <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
                <MapPin className="w-6 h-6 text-[#2B3A9F]" />
              </div>
              Branch Settings
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage office locations, addresses, and branch managers.
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
                        {activeBranches.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Active branches and office locations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Branch Name
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Location
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Address
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Manager
                      </TableHead>
                      <TableHead className="text-[#2B3A9F] font-semibold">
                        Contact
                      </TableHead>
                      <TableHead className="w-[100px] text-[#2B3A9F] font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranches.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
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
                          key={branch.id}
                          className="hover:bg-[#2B3A9F]/5 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F]">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {branch.name}
                                </span>
                                <Badge className="w-fit mt-1 bg-emerald-100 text-emerald-700 border-0 text-xs">
                                  {branch.status}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {branch.city}
                              </span>
                              <span className="text-sm text-slate-500">
                                {branch.country}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 max-w-xs truncate">
                            {branch.address}
                          </TableCell>
                          <TableCell className="text-slate-700 font-medium">
                            {branch.manager}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone className="w-3 h-3 text-[#2B3A9F]" />
                              <span className="text-sm">{branch.phone}</span>
                            </div>
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
                                  onClick={() => handleOpenForm(branch)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                  Edit Branch
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemove(branch.id)}
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
        <DialogContent className="sm:max-w-[550px] p-6 border-t-4 border-t-[#2B3A9F]">
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
                ? "Update the branch office details below."
                : "Fill in the details to register a new office location."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Branch Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="e.g., Headquarters"
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
              <Label htmlFor="address" className="text-slate-700">
                Street Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="address"
                  placeholder="e.g., 123 Main St, Suite 100"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-700">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., New York"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-700">
                  Country
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager" className="text-slate-700">
                  Branch Manager
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="manager"
                    placeholder="e.g., John Smith"
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        manager: e.target.value,
                      }))
                    }
                    className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {editingBranch && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Branch ID</span>
                  <span className="text-sm font-mono text-slate-900">
                    {editingBranch.id}
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