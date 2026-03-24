import CreateServiceOrder from "@/app/components/service-orders/CreateServiceOrder";
import { Request } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ requestId: string }>;
}

async function getRequest(supabase: any, id: string): Promise<Request | null> {
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      `
      *,
      service_category:types(name),
      company:companies(name),
      department:departments(name),
      vehicle:vehicles(vehicle_id, plate_number, car_type, owners_first_name, owners_last_name),
      payment_method:payment_methods(name),
      requested_by:users(first_name, last_name)
    `,
    )
    .eq("id", id)
    .single(); // Use .single() instead of data?.[0]

  if (error) {
    console.error("Error fetching request:", error);
    return null;
  }

  if (!data) return null;

  // Load supporting documents
  const allFileIds = (data.supporting_documents || []).filter(Boolean);
  let fileMap: Record<number, any> = {};

  if (allFileIds.length > 0) {
    const { data: files } = await supabase
      .from("files")
      .select("file_id, type, url")
      .in("file_id", allFileIds);

    fileMap = Object.fromEntries((files || []).map((f: any) => [f.file_id, f]));
  }

  // Flatten and return
  return {
    id: data.id,
    request_number: data.request_number,
    title: data.title,
    description: data.description,
    service_category: data.service_category?.name || "",
    priority_level: data.priority_level,
    company: data.company?.name || "",
    department: data.department?.name || "",
    preferred_date: data.preferred_date,
    expected_completion: data.expected_completion,
    preferred_vendor: data.preferred_vendor,
    contact_person: data.contact_person,
    required_by: data.required_by,
    payment_method: data.payment_method?.name || "",
    status: data.status,
    vehicle: data.vehicle || null,
    supporting_documents: allFileIds
      .map((id: number) => fileMap[id]?.url)
      .filter(Boolean),
    items: (data.items || []).map((i: any) => ({
      name: i.name,
      description: i.description,
      unit: i.unit,
      quantity: String(i.quantity),
      unitPrice: String(i.unitPrice),
    })),
    requested_by: data.requested_by
      ? `${data.requested_by.first_name} ${data.requested_by.last_name}`
      : "",
  };
}

async function getChartOfAccounts(supabase: any) {
  const { data, error } = await supabase
    .from("chart_of_accounts")
    .select("account_id, account_type, name")
    .order("account_type", { ascending: true });

  if (error) {
    console.error("Error fetching chart of accounts:", error);
    return [];
  }

  return data || [];
}

export default async function CreateServiceOrderPage({ params }: PageProps) {
  const { requestId } = await params;
  const supabase = await createClient();

  const request = await getRequest(supabase, requestId);
  const accounts = await getChartOfAccounts(supabase);

  if (!request) {
    notFound();
  }

  return (
    <div>
      <CreateServiceOrder request={request} accounts={accounts} />
    </div>
  );
}
