"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { SelectedRequest } from "@/lib/interfaces";

// Mock Data for Service and Purchase Requests
const mockRequests = [
  {
    id: "REQ-2024-001",
    purchaseType: "IT Equipment",
    status: "submitted",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    amount: "$12,500",
    description: "Laptop upgrades for development team",
  },
  {
    id: "REQ-2024-002",
    purchaseType: "Office Supplies",
    status: "approved",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    amount: "$850",
    description: "Quarterly office supplies restock",
  },
  {
    id: "REQ-2024-003",
    purchaseType: "Software License",
    status: "submitted",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    department: "Design",
    amount: "$3,200",
    description: "Adobe Creative Cloud annual subscription",
  },
  {
    id: "REQ-2024-004",
    purchaseType: "Consulting Services",
    status: "rejected",
    dateSubmitted: "2024-03-07",
    requestor: "Emily Davis",
    department: "Marketing",
    amount: "$25,000",
    description: "Q2 marketing strategy consulting",
  },
  {
    id: "REQ-2024-005",
    purchaseType: "Hardware",
    status: "approved",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Engineering",
    amount: "$8,750",
    description: "Server rack and networking equipment",
  },
  {
    id: "REQ-2024-006",
    purchaseType: "Training",
    status: "submitted",
    dateSubmitted: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "HR",
    amount: "$5,000",
    description: "Leadership development program",
  },
  {
    id: "REQ-2024-007",
    purchaseType: "Marketing",
    status: "approved",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    department: "Marketing",
    amount: "$15,000",
    description: "Trade show booth and materials",
  },
  {
    id: "REQ-2024-008",
    purchaseType: "Facilities",
    status: "rejected",
    dateSubmitted: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Operations",
    amount: "$45,000",
    description: "Office renovation phase 1",
  },
];

export default function ReviewRequest() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] =
    useState<SelectedRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Filter requests based on search and status filter
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purchaseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || req.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = [
    {
      title: "Total Requests",
      value: requests.length.toString(),
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "For Review",
      value: requests.filter((r) => r.status === "submitted").length.toString(),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: requests.filter((r) => r.status === "approved").length.toString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: requests.filter((r) => r.status === "rejected").length.toString(),
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  const getStatusBadge = (status: "submitted" | "approved" | "rejected") => {
    const styles = {
      submitted: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      rejected: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    };
    const labels = {
      submitted: "Submitted",
      approved: "Approved",
      rejected: "Rejected",
    };
    return (
      <Badge className={styles[status]} variant="secondary">
        {labels[status]}
      </Badge>
    );
  };

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleActionClick = (request: any, action: any) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedRequest && actionType) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: actionType } : req,
        ),
      );
      setActionDialogOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Service and Purchase Requests
        </h1>
        <p className="text-slate-500">
          Manage and track all incoming service and purchase requests in one
          place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-slate-900">
              All Service and Purchase Requests
            </CardTitle>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#2B3A9F] hover:border-[#2B3A9F]/30"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {filterStatus === "all"
                      ? "Filter"
                      : filterStatus.charAt(0).toUpperCase() +
                        filterStatus.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-[#2B3A9F]/10 focus:text-[#2B3A9F]"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-amber-50 focus:text-amber-700"
                    onClick={() => setFilterStatus("submitted")}
                  >
                    Submitted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                    onClick={() => setFilterStatus("approved")}
                  >
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-rose-50 focus:text-rose-700"
                    onClick={() => setFilterStatus("rejected")}
                  >
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-slate-500 font-medium">
                  Request ID
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Purchase Type
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Requestor
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Amount
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Date Submitted
                </TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="border-slate-100 hover:bg-slate-50/50"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {request.id}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {request.purchaseType}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <div className="flex flex-col">
                        <span>{request.requestor}</span>
                        <span className="text-xs text-slate-500">
                          {request.department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium">
                      {request.amount}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        request.status as "submitted" | "approved" | "rejected",
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(request.dateSubmitted).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(request)}
                          className="h-8 w-20 p-0 text-slate-600 hover:text-[#2B3A9F] hover:bg-[#2B3A9F]/10"
                        >
                          <Eye className="h-4 w-4" />
                          <p>View</p>
                        </Button>

                        {/* Approve Button - Only show if not already approved/rejected */}
                        {request.status === "submitted" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleActionClick(request, "approved")
                            }
                            className="h-8 w-20 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Check className="h-4 w-4" />
                            <p>Aprrove</p>
                          </Button>
                        )}

                        {/* Reject Button - Only show if not already approved/rejected */}
                        {request.status === "submitted" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleActionClick(request, "rejected")
                            }
                            className="h-8 w-20 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <X className="h-4 w-4" />
                            <p>Reject</p>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium text-slate-600 mb-1">
                        No purchase requests found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Request Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Full details for {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Request ID
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(
                      selectedRequest.status as
                        | "submitted"
                        | "approved"
                        | "rejected",
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Purchase Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.purchaseType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requestor
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.requestor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.department}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {selectedRequest.description}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Date Submitted
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(selectedRequest.dateSubmitted).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              {actionType === "approved" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Approve Request
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  Reject Request
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Are you sure you want to {actionType} {selectedRequest?.id}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={
                actionType === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }
            >
              {actionType === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
