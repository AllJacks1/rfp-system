"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  User,
  CreditCard,
  Package,
  Printer,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Types
interface RequestItem {
  item: string;
  description: string;
  unit: string;
  quantity: string;
  estimatedUnitPrice: string;
}

interface Request {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  requestor: string;
  company: string;
  department: string;
  amount: string;
  description: string;
  requiredBy: string;
  preferredVendor: string;
  vendorContactPerson: string;
  paymentMethod: string;
  items: RequestItem[];
  totalEstimatedCost: string;
}

// Mock data - replace with your actual request data
const request: Request = {
  id: "REQ-2024-005",
  title: "Aircon Maintenance Service",
  type: "Facility Maintenance",
  priority: "Low",
  status: "approved",
  dateSubmitted: "2024-03-05",
  requestor: "David Lee",
  company: "TechNova Solutions",
  department: "Facilities",
  amount: "₱600.00",
  description: "Routine cleaning and maintenance of office air conditioning units.",
  requiredBy: "2024-03-16",
  preferredVendor: "CoolAir Services",
  vendorContactPerson: "Mark Lopez",
  paymentMethod: "Bank Transfer",
  items: [
    {
      item: "Aircon Cleaning",
      description: "Split-type AC cleaning",
      unit: "unit",
      quantity: "6",
      estimatedUnitPrice: "₱70.00",
    },
    {
      item: "Freon Refill",
      description: "R410 refrigerant refill",
      unit: "service",
      quantity: "1",
      estimatedUnitPrice: "₱150.00",
    },
  ],
  totalEstimatedCost: "₱570.00",
};

// Printable Content Component
const PrintableRequest = ({ request }: { request: Request }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="print-container p-8 bg-white text-black">
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {request.title}
        </h1>
        <p className="text-gray-600 text-lg mb-4">{request.description}</p>
        <div className="flex gap-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Approved
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {request.priority} Priority
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Request Type</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-gray-400" />
            {request.type}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Department</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-gray-400" />
            {request.department}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Date Submitted</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-gray-400" />
            {formatDate(request.dateSubmitted)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Required By</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-gray-400" />
            {formatDate(request.requiredBy)}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Requested Items <span className="text-gray-500 font-normal">({request.items.length} items in this request)</span>
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700 w-12">#</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Item</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-700">Description</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-700">Unit Price</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((item, index) => {
              const qty = parseFloat(item.quantity) || 0;
              const price = parseFloat(item.estimatedUnitPrice.replace(/[₱,]/g, "")) || 0;
              const total = qty * price;

              return (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-300 px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">{item.item}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.description}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-mono">{item.estimatedUnitPrice}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-mono font-bold text-gray-900">
                    ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mt-4">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 min-w-[280px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Estimated Cost:</span>
              <span className="text-2xl font-bold text-green-600">{request.totalEstimatedCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Info */}
      <div className="grid grid-cols-2 gap-8">
        {/* Requestor Info */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">Requestor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {request.requestor.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{request.requestor}</p>
                <p className="text-sm text-gray-500">{request.department}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase">Company</p>
              <p className="font-semibold flex items-center gap-2 text-gray-900">
                <Building2 className="h-4 w-4 text-gray-400" />
                {request.company}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vendor & Payment Info Combined */}
        <div className="space-y-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-base font-bold text-gray-900">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium uppercase">Preferred Vendor</p>
                <p className="font-semibold flex items-center gap-2 text-gray-900">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {request.preferredVendor}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium uppercase">Contact Person</p>
                <p className="font-semibold flex items-center gap-2 text-gray-900">
                  <User className="h-4 w-4 text-gray-400" />
                  {request.vendorContactPerson}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-base font-bold text-gray-900">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium uppercase">Payment Method</p>
                <p className="font-semibold flex items-center gap-2 text-gray-900">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  {request.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium uppercase">Amount</p>
                <p className="font-bold flex items-center gap-2 text-xl text-blue-700">
                  <CreditCard className="h-5 w-5" />
                  {request.amount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t-2 border-gray-200 text-center text-sm text-gray-500">
        <p className="font-medium">Request ID: {request.id}</p>
        <p className="mt-1">Generated on {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
    </div>
  );
};

// Main Page Component
export default function PrintServiceOrderPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${request.id}_${request.title.replace(/\s+/g, "_")}`,
    pageStyle: `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-container {
          padding: 0 !important;
        }
      }
    `,
    onBeforePrint: async () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header Actions - Hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/requests">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Print Preview</h1>
            <p className="text-sm text-muted-foreground">
              {request.id} • {request.title}
            </p>
          </div>
        </div>
        <Button onClick={handlePrint} size="lg">
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div ref={contentRef} className="bg-white shadow-lg rounded-lg print:shadow-none">
        <PrintableRequest request={request} />
      </div>
    </div>
  );
}