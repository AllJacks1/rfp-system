"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { DataTableCard, Column } from "@/app/components/cards/DataTableCard";

// Types
interface PurchaseRequest {
  id: string;
  title: string;
  purchaseType: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  department: string;
  amount: string;
  description: string;
  vendor: string;
}

// Mock Data for Purchase Requests
const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: "PR-2024-001",
    title: "Laptop Upgrades for Dev Team",
    purchaseType: "IT Equipment",
    status: "submitted",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    amount: "$12,500",
    description: "15 MacBook Pro laptops for new developers",
    vendor: "Apple Inc.",
  },
  {
    id: "PR-2024-002",
    title: "Q1 Office Supplies Restock",
    purchaseType: "Office Supplies",
    status: "approved",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    amount: "$850",
    description: "Paper, pens, folders, and other stationary",
    vendor: "Staples",
  },
  {
    id: "PR-2024-003",
    title: "Adobe Creative Cloud Licenses",
    purchaseType: "Software License",
    status: "submitted",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    department: "Design",
    amount: "$3,200",
    description: "Annual subscription for 10 design team members",
    vendor: "Adobe",
  },
  {
    id: "PR-2024-004",
    title: "Q2 Marketing Strategy Consulting",
    purchaseType: "Consulting Services",
    status: "rejected",
    dateSubmitted: "2024-03-07",
    requestor: "Emily Davis",
    department: "Marketing",
    amount: "$25,000",
    description: "External marketing firm for campaign strategy",
    vendor: "McKinsey & Company",
  },
  {
    id: "PR-2024-005",
    title: "Server Rack and Networking Equipment",
    purchaseType: "Hardware",
    status: "approved",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Engineering",
    amount: "$8,750",
    description: "48U server rack with switches and cables",
    vendor: "Dell Technologies",
  },
  {
    id: "PR-2024-006",
    title: "Leadership Development Program",
    purchaseType: "Training",
    status: "submitted",
    dateSubmitted: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "HR",
    amount: "$5,000",
    description: "Executive coaching for senior managers",
    vendor: "FranklinCovey",
  },
  {
    id: "PR-2024-007",
    title: "Trade Show Booth and Materials",
    purchaseType: "Marketing",
    status: "approved",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    department: "Marketing",
    amount: "$15,000",
    description: "10x10 booth, banners, and promotional items for TechExpo",
    vendor: "Expo Solutions LLC",
  },
  {
    id: "PR-2024-008",
    title: "Office Renovation Phase 1",
    purchaseType: "Facilities",
    status: "rejected",
    dateSubmitted: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Operations",
    amount: "$45,000",
    description: "Flooring and lighting upgrade for 3rd floor",
    vendor: "BuildRight Construction",
  },
];

export default function PurchaseRequest() {
  const router = useRouter();
  const [requests, setRequests] =
    useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getStatusBadge = (status: PurchaseRequest["status"]) => {
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

  const handleView = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  // Stats calculation
  const stats = [
    {
      title: "Total Requests",
      value: requests.length,
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "Submitted",
      value: requests.filter((r) => r.status === "submitted").length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: requests.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: requests.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Define columns for Purchase Requests
  const columns: Column<PurchaseRequest>[] = [
    { key: "id", header: "Request ID", width: "w-[140px]" },
    { key: "title", header: "Request Title", width: "min-w-[200px]" },
    { key: "purchaseType", header: "Purchase Type", width: "w-[180px]" },
    {
      key: "requestor",
      header: "Requestor",
      width: "w-[140px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.requestor}</span>
          <span className="text-xs text-slate-500">{row.department}</span>
        </div>
      ),
    },
    { key: "amount", header: "Amount", width: "w-[100px]" },
    {
      key: "status",
      header: "Status",
      width: "w-[110px]",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "dateSubmitted",
      header: "Date Submitted",
      width: "w-[130px]",
      render: (row) =>
        new Date(row.dateSubmitted).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const filterOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50/50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Purchase Requests
        </h1>
        <p className="text-slate-500">
          Manage and track all your purchase requests in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm bg-white">
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

      {/* Data Table Card - Only View Action */}
      <DataTableCard
        data={requests}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Purchase Requests"
        subtitle="View and manage your purchase requests"
        searchPlaceholder="Search requests..."
        searchable
        searchKeys={[
          "id",
          "title",
          "purchaseType",
          "requestor",
          "department",
          "vendor",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20"
            onClick={() =>
              router.push("/home/finance/purchase-requests/create-pr")
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Purchase Request
          </Button>
        }
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row)}
            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:text-[#2B3A9F] hover:border-[#2B3A9F]/30 hover:bg-[#2B3A9F]/5"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
        )}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Purchase Request Details
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
                    {getStatusBadge(selectedRequest.status)}
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
                  <p className="text-sm font-medium text-slate-500">Vendor</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.vendor}
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
