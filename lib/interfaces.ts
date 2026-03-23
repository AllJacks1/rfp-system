export interface NavItem {
  icon?: React.ComponentType;
  label: string;
  href?: string;
  badge?: string;
  subsections?: NavItem[]; // Recursive reference
}

export interface TopNavigationProps {
  notifications?: Notifications[];
}

export interface NotificationsProps {
  initialNotifications: Notifications[];
}

export interface Notifications {
  id: number;
  title: string;
  time: string;
  unread: boolean;
}

export interface SelectedRequest {
  id: string;
  title: string;
  purchaseType: string;
  status: string;
  dateSubmitted: string;
  requestor: string;
  department: string;
  amount: string;
  description: string;
}

export interface Request {
  id: string;
  title: string;
  purchaseType: string;
  requestor: string;
  department: string;
  amount: string;
  status: "submitted" | "approved" | "rejected";
  dateSubmitted: string;
  description: string;
}

export interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export interface User {
  id: string;
  username?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  address?: string;
  birthday?: string;
  sex: string;
  auth_id: string;
}

export interface Company {
  company_id: string;
  name: string;
}

export interface Branch {
  branch_id: string;
  location: string;
  company?: Company;
}

export interface Department {
  department_id: string;
  name: string;
  branch_id?: string;
  branch_location?: string;
  company_id?: string;
  company_name: string;
}

export interface Role {
  role_id: string;
  name: string;
}

export interface SettingsPageProps {
  users: FlattendUser[];
  companies: Company[];
  branches: Branch[];
  department: Department[];
  roles: Role[];
  designations: Designation[];
}

export interface CompanySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
}

export interface BranchSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  companies: Company[];
}

export interface DepartmentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  branches: Branch[];
}

export interface RolesSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
}

export interface FlattendUser {
  user_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  mobile_number: string | null;
  address: string | null;
  birthday: string | null;
  sex: string | null;
  role_id: string;
  role_name: string;
  designation_id: string;
  designation_name: string;
  company_id: string;
  company_name: string;
  branch_id: string;
  branch_location: string;
  department_id: string;
  department_name: string;
}

export type UserAssignmentRow = {
  users: {
    user_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string | null;
    mobile_number: string | null;
    address: string | null;
    birthday: string | null;
    sex: string | null;
  };
  roles: { role_id: string; name: string };
  designations: { designation_id: string; name: string };
  companies: { company_id: string; name: string };
  branches: { branch_id: string; location: string; company_id: string };
  departments: { department_id: string; name: string; branch_id: string };
};

export interface Designation {
  designation_id: number;
  name: string;
  scope: string;
}

export interface UserAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: FlattendUser[];
  companies: Company[];
  branches: Branch[];
  departments: Department[];
  designations: Designation[];
  roles: Role[];
}

export interface Account {
  account_id: string;
  account_type: string;
  name: string;
}

export interface ChartOfAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

export interface FinanceSettingsProps {
  accounts: Account[];
  types: Type[];
  units: Unit[];
  vehicles: Vehicle[];
  vendors: Vendor[];
  banks: Bank[];
  methods: PaymentMethod[];
}

export interface FinanceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count?: string;
  onClick?: () => void;
}

export interface Type {
  type_id: string;
  name: string;
}

export interface TypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: Type[];
  onTypesChange?: (types: Type[]) => void;
}

export interface Unit {
  unit_id: string;
  name: string;
}

export interface UnitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: Unit[];
  onUnitsChange?: (units: Unit[]) => void;
}

export interface Vehicle {
  vehicle_id: string;
  plate_number: string;
  car_type: string;
  owners_first_name: string;
  owners_last_name: string;
}

export interface AssetVehiclesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  onVehiclesChange?: (vehicles: Vehicle[]) => void;
}

export interface Vendor {
  vendor_id: string;
  name: string;
  contact_person?: string;
  payment_terms?: string;
}

export interface SuppliersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: Vendor[];
  onVendorsChange?: (vendors: Vendor[]) => void;
}

export interface Bank {
  bank_id: string;
  name: string;
}

export interface BanksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banks: Bank[];
  onBanksChange?: (banks: Bank[]) => void;
}

export interface PaymentMethod {
  payment_method_id: string;
  name: string;
}

export interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethods: PaymentMethod[];
  onPaymentMethodsChange?: (paymentMethods: PaymentMethod[]) => void;
}

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateServiceRequestFormProps {
  types: Type[],
  companies: Company[],
  departments: Department[],
  vehicles: Vehicle[],
  vendors: Vendor[],
  paymentMethods?: PaymentMethod[],
}