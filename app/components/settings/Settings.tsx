// Settings.tsx
"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UserAccountDialog from "./UserAccountDialog";
import CompanySettingsDialog from "./CompanySettingsDialog";
import BranchSettingsDialog from "./BranchSettingsDialog";
import DepartmentSettingsDialog from "./DepartmentSettingsDialog";
import RolesSettingsDialog from "./RolesSettingDialog";

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

const Settings = () => {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);

  const settingsCategories: SettingsCardProps[] = [
    {
      title: "User Account Settings",
      description: "Manage your user accounts",
      icon: User,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
      onClick: () => setAccountDialogOpen(true),
    },
    {
      title: "Company Settings",
      description: "Configure company information",
      icon: Building2,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
      onClick: () => setCompanyDialogOpen(true),
    },
    {
      title: "Branch Settings",
      description: "Manage office locations",
      icon: MapPin,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
      onClick: () => setBranchDialogOpen(true),
    },
    {
      title: "Department Settings",
      description: "Organize your departments",
      icon: Users,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
      onClick: () => setDepartmentDialogOpen(true),
    },
    {
      title: "Roles Settings",
      description: "Define the roles of your employees",
      icon: ShieldCheck,
      color: "text-[#2B3A9F]",
      bgColor: "bg-[#2B3A9F]/10",
      onClick: () => setRolesDialogOpen(true),
    },
  ];

  const SettingsCard = ({ category }: { category: SettingsCardProps }) => {
    const cardContent = (
      <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:shadow-[#2B3A9F]/5 transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-[#2B3A9F]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div
              className={`p-3 rounded-xl ${category.bgColor} transition-transform group-hover:scale-110 duration-300`}
            >
              <category.icon className={`h-6 w-6 ${category.color}`} />
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#2B3A9F] group-hover:translate-x-1 transition-all" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#2B3A9F] transition-colors">
            {category.title}
          </CardTitle>
          <CardDescription className="text-slate-500 leading-relaxed">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    );

    if (category.onClick) {
      return (
        <button onClick={category.onClick} className="group text-left w-full">
          {cardContent}
        </button>
      );
    }

    return (
      <Link href={category.href!} className="group">
        {cardContent}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500 max-w-2xl">
          Configure system preferences, manage organizational structure, and
          customize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <SettingsCard key={category.title} category={category} />
        ))}
      </div>

      <UserAccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />
      <CompanySettingsDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
      />
      <BranchSettingsDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
      />
      <DepartmentSettingsDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
      />
      <RolesSettingsDialog
        open={rolesDialogOpen}
        onOpenChange={setRolesDialogOpen}
      />
    </div>
  );
};

export default Settings;
