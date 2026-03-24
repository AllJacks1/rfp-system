import ServiceOrder from "@/app/components/service-orders/ServiceOrder";
import { Request } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";

async function getApprovedRequests(supabase: any): Promise<Request[]> {
  // 1️⃣ Get all request IDs that already have service orders
  const { data: existingOrders, error: orderError } = await supabase
    .from("service_orders")
    .select("service_request_id");

  if (orderError) {
    console.error("Error fetching service orders:", orderError);
    return [];
  }

  const orderedRequestIds =
    existingOrders?.map((o: any) => o.service_request_id) ?? [];

  // 2️⃣ Build query for approved requests
  let query = supabase
    .from("service_requests")
    .select(
      `
      *,
      service_category:types(name),
      company:companies(name),
      department:departments(name),
      vehicle:vehicles(vehicle_id, plate_number, car_type, owners_first_name, owners_last_name),
      payment_method:payment_methods(name)
    `,
    )
    .eq("status", "approved");

  // Exclude requests that already have service orders
  if (orderedRequestIds.length > 0) {
    query = query.not("id", "in", `(${orderedRequestIds.join(",")})`);
  }

  const { data, error } = await query.order("request_number", {
    ascending: true,
  });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }

  const requests = data || [];

  // 3️⃣ Collect all file IDs
  const allFileIds = requests
    .flatMap((r: any) => r.supporting_documents || [])
    .filter(Boolean);

  let fileMap: Record<number, any> = {};

  if (allFileIds.length > 0) {
    const { data: files } = await supabase
      .from("files")
      .select("file_id, type, url")
      .in("file_id", allFileIds);

    fileMap = Object.fromEntries((files || []).map((f: any) => [f.file_id, f]));
  }

  // 4️⃣ Transform into your Request interface
  const flattened: Request[] = requests.map((r: any) => ({
    id: r.id,
    request_number: r.request_number,
    title: r.title,
    description: r.description,

    service_category: r.service_category?.name || "",
    priority_level: r.priority_level,

    company: r.company?.name || "",
    department: r.department?.name || "",

    preferred_date: r.preferred_date,
    expected_completion: r.expected_completion,

    preferred_vendor: r.preferred_vendor,
    contact_person: r.contact_person,

    required_by: r.required_by,

    payment_method: r.payment_method?.name || "",

    status: r.status,

    vehicle: r.vehicle || null,

    // convert file IDs → URLs
    supporting_documents: (r.supporting_documents || [])
      .map((id: number) => fileMap[id]?.url)
      .filter(Boolean),

    // normalize items
    items: (r.items || []).map((i: any) => ({
      name: i.name,
      description: i.description,
      unit: i.unit,
      quantity: String(i.quantity),
      unitPrice: String(i.unitPrice),
    })),
  }));

  return flattened;
}

export default async function ServiceOrderPage() {
  const supabase = await createClient();

  const requests = await getApprovedRequests(supabase);
  return (
    <div>
      <ServiceOrder requests={requests} />
    </div>
  );
}
