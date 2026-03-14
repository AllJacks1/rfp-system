"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, Search, ShieldCheck, Trash2, Eye, Pencil, CheckCircle, XCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useState } from 'react'

interface Permission {
  module: string
  access: 'full' | 'read' | 'none'
}

interface Role {
  id: string
  name: string
  description: string
  users: number
  permissions: Permission[]
  createdAt: string
  isDefault: boolean
  status: 'active' | 'inactive'
}

const mockRoles: Role[] = [
  { 
    id: '1', 
    name: 'Administrator', 
    description: 'Full system access and configuration rights', 
    users: 3, 
    permissions: [{ module: 'All Modules', access: 'full' }],
    createdAt: '2023-01-01',
    isDefault: true,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Manager', 
    description: 'Department management and team oversight', 
    users: 12, 
    permissions: [{ module: 'Reports, Users', access: 'full' }, { module: 'Settings', access: 'read' }],
    createdAt: '2023-02-15',
    isDefault: true,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Editor', 
    description: 'Content creation and modification rights', 
    users: 28, 
    permissions: [{ module: 'Content', access: 'full' }, { module: 'Reports', access: 'read' }],
    createdAt: '2023-03-10',
    isDefault: false,
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Viewer', 
    description: 'Read-only access to assigned resources', 
    users: 45, 
    permissions: [{ module: 'Reports', access: 'read' }],
    createdAt: '2023-04-05',
    isDefault: true,
    status: 'active'
  },
  { 
    id: '5', 
    name: 'Guest', 
    description: 'Limited temporary access', 
    users: 8, 
    permissions: [{ module: 'Limited Content', access: 'read' }],
    createdAt: '2023-06-20',
    isDefault: false,
    status: 'inactive'
  },
]

interface RolesSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RolesSettingsDialog({ open, onOpenChange }: RolesSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roles, setRoles] = useState<Role[]>(mockRoles)

  const activeRoles = roles.filter(r => r.status === 'active')
  const filteredRoles = activeRoles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRemove = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-250 lg:max-w-300 w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
            <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
              <ShieldCheck className="w-6 h-6 text-[#2B3A9F]" />
            </div>
            Roles Settings
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Define roles, permissions, and access levels for employees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
              />
            </div>
            <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Employee Roles
                    <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                      {activeRoles.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Active roles and permission sets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-[#2B3A9F] font-semibold">Role Name</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Description</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Users</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Permissions</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Default</TableHead>
                    <TableHead className="w-25 text-[#2B3A9F] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <ShieldCheck className="w-8 h-8 text-slate-300" />
                          <p>No roles found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id} className="hover:bg-[#2B3A9F]/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F]">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{role.name}</span>
                              <span className="text-xs text-slate-500">Created {formatDate(role.createdAt)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-xs">
                          <span className="truncate block">{role.description}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-0">
                            {role.users} users
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {role.permissions.map((perm, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600">{perm.module}:</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    perm.access === 'full' 
                                      ? 'border-emerald-300 text-emerald-700 bg-emerald-50' 
                                      : 'border-amber-300 text-amber-700 bg-amber-50'
                                  }`}
                                >
                                  {perm.access}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {role.isDefault ? (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm">No</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-[#2B3A9F]/10 hover:text-[#2B3A9F]"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel className="text-xs text-slate-500">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                <Eye className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-[#2B3A9F]/5 hover:text-[#2B3A9F]">
                                <Pencil className="w-4 h-4 mr-2 text-[#2B3A9F]" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(role.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}