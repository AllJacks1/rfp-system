"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import { DataTableCard, Column } from "@/app/components/cards/DataTableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface RequestForPayment {
  id: string;
  rfpTitle: string;
  paymentType: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  department: string;
  amount: string;
  description: string;
  vendor: string;
  invoiceNumber?: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Mock Purchase Orders that can be converted to RFP
interface Order {
  id: string;
  poTitle: string;
  poType: string;
  status: "approved";
  dateApproved: string;
  requestor: string;
  department: string;
  vendor: string;
  totalAmount: string;
  description: string;
}

const mockPurchaseOrders: Order[] = [
  {
    id: "PO-2024-001",
    poTitle: "Q1 Software License Payment",
    poType: "Software License",
    status: "approved",
    dateApproved: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    vendor: "Microsoft / AWS",
    totalAmount: "$12,500",
    description: "Payment for annual Microsoft 365 and AWS subscriptions",
  },
  {
    id: "PO-2024-002",
    poTitle: "Office Rent - March 2024",
    poType: "Rent",
    status: "approved",
    dateApproved: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    vendor: "Prime Properties LLC",
    totalAmount: "$25,000",
    description: "Monthly office space rental payment",
  },
  {
    id: "PO-2024-003",
    poTitle: "Marketing Campaign Payment",
    poType: "Marketing Services",
    status: "approved",
    dateApproved: "2024-03-08",
    requestor: "Mike Chen",
    department: "Marketing",
    vendor: "Digital Marketing Pro",
    totalAmount: "$15,000",
    description: "Payment for Q1 digital marketing campaign execution",
  },
];

const mockRFPs: RequestForPayment[] = [
  {
    id: "RFP-2024-001",
    rfpTitle: "Q1 Software License Payment",
    paymentType: "Software License",
    status: "submitted",
    dateSubmitted: "2024-03-10",
    requestor: "John Smith",
    department: "Engineering",
    amount: "$12,500",
    description: "Payment for annual Microsoft 365 and AWS subscriptions",
    vendor: "Microsoft / AWS",
    invoiceNumber: "INV-2024-001",
  },
  {
    id: "RFP-2024-002",
    rfpTitle: "Office Rent - March 2024",
    paymentType: "Rent",
    status: "approved",
    dateSubmitted: "2024-03-09",
    requestor: "Sarah Johnson",
    department: "Administration",
    amount: "$25,000",
    description: "Monthly office space rental payment",
    vendor: "Prime Properties LLC",
    invoiceNumber: "INV-2024-002",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-09",
  },
  {
    id: "RFP-2024-003",
    rfpTitle: "Marketing Campaign Payment",
    paymentType: "Marketing Services",
    status: "submitted",
    dateSubmitted: "2024-03-08",
    requestor: "Mike Chen",
    department: "Marketing",
    amount: "$15,000",
    description: "Payment for Q1 digital marketing campaign execution",
    vendor: "Digital Marketing Pro",
    invoiceNumber: "INV-2024-003",
  },
  {
    id: "RFP-2024-004",
    rfpTitle: "Consulting Fees - Q1",
    paymentType: "Consulting",
    status: "rejected",
    dateSubmitted: "2024-03-07",
    requestor: "Emily Davis",
    department: "Strategy",
    amount: "$45,000",
    description: "Strategy consulting fees for market expansion project",
    vendor: "McKinsey & Company",
    invoiceNumber: "INV-2024-004",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-07",
  },
  {
    id: "RFP-2024-005",
    rfpTitle: "IT Equipment Maintenance",
    paymentType: "Maintenance",
    status: "approved",
    dateSubmitted: "2024-03-06",
    requestor: "Robert Wilson",
    department: "Engineering",
    amount: "$3,500",
    description: "Quarterly server and network equipment maintenance",
    vendor: "TechSupport Inc.",
    invoiceNumber: "INV-2024-005",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-06",
  },
  {
    id: "RFP-2024-006",
    rfpTitle: "Employee Training Program",
    paymentType: "Training",
    status: "submitted",
    dateSubmitted: "2024-03-05",
    requestor: "Lisa Anderson",
    department: "HR",
    amount: "$8,000",
    description: "Payment for leadership development workshop",
    vendor: "FranklinCovey",
    invoiceNumber: "INV-2024-006",
  },
  {
    id: "RFP-2024-007",
    rfpTitle: "Travel Expenses - Sales Team",
    paymentType: "Travel",
    status: "approved",
    dateSubmitted: "2024-03-04",
    requestor: "David Brown",
    department: "Sales",
    amount: "$5,200",
    description: "Client visit travel expenses for March",
    vendor: "Various Airlines/Hotels",
    invoiceNumber: "INV-2024-007",
    approvedBy: "Michael Brown",
    approvedDate: "2024-03-04",
  },
  {
    id: "RFP-2024-008",
    rfpTitle: "Legal Services - Contract Review",
    paymentType: "Legal",
    status: "rejected",
    dateSubmitted: "2024-03-03",
    requestor: "Jennifer Lee",
    department: "Legal",
    amount: "$18,000",
    description: "External legal counsel for merger documentation",
    vendor: "Baker & McKenzie",
    invoiceNumber: "INV-2024-008",
    approvedBy: "Lisa Wong",
    approvedDate: "2024-03-03",
  },
];

export default function RequestForPayment() {
  const [rfps, setRfps] = useState<RequestForPayment[]>(mockRFPs);
  const [selectedRfp, setSelectedRfp] = useState<RequestForPayment | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const router = useRouter();

  // New state for approved POs dialog
  const [approvedPODialogOpen, setApprovedPODialogOpen] = useState(false);

  const getStatusBadge = (status: RequestForPayment["status"]) => {
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

  const handleView = (rfp: RequestForPayment) => {
    setSelectedRfp(rfp);
    setViewDialogOpen(true);
  };

  const handleReviewOrders = () => {
    setApprovedPODialogOpen(true);
  };

  const handleCreateRFP = (order: Order) => {
    // Logic to create RFP from approved PO
    console.log("Creating RFP from PO:", order.id);
    setApprovedPODialogOpen(false);
    router.push(`/home/finance/request-for-payment/create-rfp?orderId=${order.id}`);
  };

  // Stats calculation
  const stats = [
    {
      title: "Total Requests",
      value: rfps.length,
      icon: FileText,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
    },
    {
      title: "Submitted",
      value: rfps.filter((r) => r.status === "submitted").length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: rfps.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: rfps.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Define columns for RFP
  const columns: Column<RequestForPayment>[] = [
    { key: "id", header: "RFP ID", width: "w-[140px]" },
    { key: "rfpTitle", header: "RFP Title", width: "min-w-[200px]" },
    { key: "paymentType", header: "Payment Type", width: "w-[160px]" },
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
          Requests for Payment
        </h1>
        <p className="text-slate-500">
          Manage and track all your RFP requests in one place
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
        data={rfps}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All RFP Requests"
        subtitle="View and manage your requests for payment"
        searchPlaceholder="Search RFPs..."
        searchable
        searchKeys={[
          "id",
          "rfpTitle",
          "paymentType",
          "requestor",
          "department",
          "vendor",
          "invoiceNumber",
        ]}
        filterable
        filterKey="status"
        filterOptions={filterOptions}
        pagination
        defaultPageSize={5}
        headerActions={
          <Button
            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white shadow-lg shadow-[#2B3A9F]/25 transition-all hover:shadow-xl hover:shadow-[#2B3A9F]/20"
            onClick={handleReviewOrders}
          >
            <Plus className="mr-2 h-4 w-4" />
            Review Orders
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
              RFP Request Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Full details for {selectedRfp?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedRfp && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">RFP ID</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRfp.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Payment Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.paymentType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vendor</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.vendor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Invoice Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.invoiceNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requestor
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.requestor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRfp.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date Submitted
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedRfp.dateSubmitted).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                {selectedRfp.approvedBy && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {selectedRfp.status === "approved"
                        ? "Approved By"
                        : "Rejected By"}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedRfp.approvedBy}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {selectedRfp.description}
                </p>
              </div>
              {selectedRfp.approvedDate && (
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {selectedRfp.status === "approved"
                      ? "Approved Date"
                      : "Rejected Date"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedRfp.approvedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW: Approved Purchase Orders Dialog */}
      <Dialog
        open={approvedPODialogOpen}
        onOpenChange={setApprovedPODialogOpen}
      >
        <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-900 tracking-tight">
                  Approved Purchase and Service Orders
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Select a purchase order or service order to create a new request for payment
                </DialogDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {mockPurchaseOrders.length} orders
              </Badge>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
            {mockPurchaseOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No approved orders
                </h3>
                <p className="text-sm text-slate-500">
                  There are no approved purchase or service orders available at this time.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-[140px]">
                        PO ID
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 w-[140px]">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-slate-600 py-4 text-right w-[180px]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPurchaseOrders.map((po) => (
                      <TableRow
                        key={po.id}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-sm text-slate-700 py-4">
                          {po.id}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900 py-4">
                          {po.poTitle}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 py-4">
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-300 text-slate-600"
                          >
                            {po.poType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            size="sm"
                            onClick={() => handleCreateRFP(po)}
                            className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/80 text-white gap-2"
                          >
                            Create RFP
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-slate-50">
            <div className="mb-4 mr-4">
              <Button
                variant="outline"
                onClick={() => setApprovedPODialogOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
