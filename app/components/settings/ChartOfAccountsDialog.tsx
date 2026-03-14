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
  BookOpen,
  Trash2,
  Eye,
  Pencil,
  Hash,
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

interface Account {
  id: string;
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  category: string;
  balance: string;
  status: "active" | "inactive";
}

const mockAccounts: Account[] = [
  {
    id: "1",
    code: "1000",
    name: "Cash and Cash Equivalents",
    type: "Asset",
    category: "Current Assets",
    balance: "$125,000.00",
    status: "active",
  },
  {
    id: "2",
    code: "1100",
    name: "Accounts Receivable",
    type: "Asset",
    category: "Current Assets",
    balance: "$45,500.00",
    status: "active",
  },
  {
    id: "3",
    code: "1200",
    name: "Inventory",
    type: "Asset",
    category: "Current Assets",
    balance: "$78,200.00",
    status: "active",
  },
  {
    id: "4",
    code: "2000",
    name: "Accounts Payable",
    type: "Liability",
    category: "Current Liabilities",
    balance: "$32,100.00",
    status: "active",
  },
  {
    id: "5",
    code: "3000",
    name: "Owner Equity",
    type: "Equity",
    category: "Equity",
    balance: "$216,600.00",
    status: "active",
  },
];

interface ChartOfAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChartOfAccountsDialog({
  open,
  onOpenChange,
}: ChartOfAccountsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);

  const activeAccounts = accounts.filter((a) => a.status === "active");
  const filteredAccounts = activeAccounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.includes(searchQuery) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemove = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Asset":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Liability":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Equity":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Revenue":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Expense":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-indigo-600">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-indigo-600">
            <div className="p-2 rounded-lg bg-indigo-50">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            Chart of Accounts
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Manage account titles, categories, and financial classifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Accounts
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200">
                      {activeAccounts.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Financial accounts and classifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-indigo-600 font-semibold">
                      Code
                    </TableHead>
                    <TableHead className="text-indigo-600 font-semibold">
                      Account Name
                    </TableHead>
                    <TableHead className="text-indigo-600 font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-indigo-600 font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-indigo-600 font-semibold">
                      Balance
                    </TableHead>
                    <TableHead className="w-[100px] text-indigo-600 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-400 py-12"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="w-8 h-8 text-slate-300" />
                          <p>No accounts found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow
                        key={account.id}
                        className="hover:bg-indigo-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-indigo-600" />
                            <span className="font-mono font-medium text-indigo-600">
                              {account.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-slate-900">
                            {account.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getTypeColor(account.type)}
                          >
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {account.category}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {account.balance}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-indigo-100 hover:text-indigo-600"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel className="text-xs text-slate-500">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600">
                                <Eye className="w-4 h-4 mr-2 text-indigo-600" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600">
                                <Pencil className="w-4 h-4 mr-2 text-indigo-600" />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(account.id)}
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
