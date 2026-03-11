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
interface ServiceRequest {
  id: string;
  title: string;
  serviceType: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  department: string;
  description: string;
  priority: "low" | "medium" | "high";
}

// Mock Data for Service Requests
const mockServiceRequests: ServiceRequest[] = [
  {
    id: "SR-2024-001",
    title: "Network Infrastructure Upgrade",
    serviceType: "IT Services",
    status: "submitted",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    description: "Upgrade office network to support 10Gbps",
    priority: "high",
  },
  {
    id: "SR-2024-002",
    title: "Office Cleaning Services",
    serviceType: "Facilities",
    status: "approved",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    description: "Weekly deep cleaning for main office",
    priority: "medium",
  },
  {
    id: "SR-2024-003",
    title: "Security System Maintenance",
    serviceType: "Security",
    status: "submitted",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    department: "Operations",
    description: "Annual maintenance of CCTV and access control",
    priority: "high",
  },
  {
    id: "SR-2024-004",
    title: "Catering for Q1 Meeting",
    serviceType: "Catering",
    status: "rejected",
    dateSubmitted: "2024-03-07",
    requestor: "Emily Davis",
    department: "Marketing",
    description: "Lunch catering for quarterly all-hands",
    priority: "low",
  },
  {
    id: "SR-2024-005",
    title: "HVAC Repair",
    serviceType: "Facilities",
    status: "approved",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Operations",
    description: "Repair air conditioning in Conference Room B",
    priority: "high",
  },
  {
    id: "SR-2024-006",
    title: "Software Development Consulting",
    serviceType: "Professional Services",
    status: "submitted",
    dateSubmitted: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "Engineering",
    description: "External consulting for microservices architecture",
    priority: "medium",
  },
  {
    id: "SR-2024-007",
    title: "Employee Transport Service",
    serviceType: "Transportation",
    status: "approved",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    department: "HR",
    description: "Shuttle service for night shift employees",
    priority: "medium",
  },
  {
    id: "SR-2024-008",
    title: "Event Management",
    serviceType: "Events",
    status: "rejected",
    dateSubmitted: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Marketing",
    description: "Annual company retreat planning and execution",
    priority: "low",
  },
];

export default function ServiceRequest() {
  const router = useRouter();
  const [requests, setRequests] =
    useState<ServiceRequest[]>(mockServiceRequests);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getStatusBadge = (status: ServiceRequest["status"]) => {
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

  const getPriorityBadge = (priority: ServiceRequest["priority"]) => {
    const styles = {
      low: "bg-slate-100 text-slate-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
    };
    return (
      <Badge className={styles[priority]} variant="secondary">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleView = (request: ServiceRequest) => {
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

  // Define columns for Service Requests
  const columns: Column<ServiceRequest>[] = [
    { key: "id", header: "Request ID", width: "w-[140px]" },
    { key: "title", header: "Request Title", width: "min-w-[200px]" },
    { key: "serviceType", header: "Service Type", width: "w-[160px]" },
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
    {
      key: "priority",
      header: "Priority",
      width: "w-[100px]",
      render: (row) => getPriorityBadge(row.priority),
    },
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
          Service Requests
        </h1>
        <p className="text-slate-500">
          Manage and track all your service requests in one place
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
        title="All Service Requests"
        subtitle="View and manage your service requests"
        searchPlaceholder="Search requests..."
        searchable
        searchKeys={["id", "title", "serviceType", "requestor", "department"]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white"
            onClick={() =>
              router.push("/home/finance/service-requests/create-sr")
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Service Request
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
              Service Request Details
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
                    Service Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Priority</p>
                  <div className="mt-1">
                    {getPriorityBadge(selectedRequest.priority)}
                  </div>
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
    </div>
  );
}
