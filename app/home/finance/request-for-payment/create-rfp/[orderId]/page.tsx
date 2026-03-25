import CreateRequestForPayment from "@/app/components/request-for-payment/CreateRequestForPayment";
import { Order, Request } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

async function getServiceOrder(
  supabase: any,
  id: string,
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("service_orders")
    .select(
      `
      *,
      service_requests(
      service_category:types(name),
      company:companies(name),
      department:departments(name),
      vehicle:vehicles(vehicle_id, plate_number, car_type, owners_first_name, owners_last_name),
      payment_method:payment_methods(name),
      requested_by:users(first_name, last_name),
      order_prepared_by:users(first_name, last_name)
      )
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
    order_number: data.order_number,
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
    order_prepared_by: data.order_prepared_by
      ? `${data.order_prepared_by.first_name} ${data.order_prepared_by.last_name}`
      : "",
  };
}

async function getPurchaseOrder(
  supabase: any,
  id: string,
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      `
      *,
      purchase_requests(purchase_category:types(name),
      company:companies(name),
      department:departments(name),
      vehicle:vehicles(vehicle_id, plate_number, car_type, owners_first_name, owners_last_name),
      payment_method:payment_methods(name),
      requested_by:users(first_name, last_name),
      order_prepared_by:users(first_name, last_name))
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
    order_number: data.order_number,
    title: data.title,
    description: data.description,
    service_category: data.purchase_category?.name || "",
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
    order_prepared_by: data.order_prepared_by
      ? `${data.order_prepared_by.first_name} ${data.order_prepared_by.last_name}`
      : "",
  };
}

async function getOrder(supabase: any, id: string): Promise<Order | null> {
  try {
    const serviceOrder = await getServiceOrder(supabase, id);
    if (serviceOrder) return serviceOrder;

    const purchaseOrder = await getPurchaseOrder(supabase, id);
    if (purchaseOrder) return purchaseOrder;

    console.log("fck")
    return null;
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
}

export default async function CreateRequestForPaymentPage({
  params,
}: PageProps) {
  const { orderId } = await params;
  const supabase = await createClient();

  const order = await getOrder(supabase, orderId);

  return (
    <div>
      <CreateRequestForPayment order={order}/>
    </div>
  );
}
