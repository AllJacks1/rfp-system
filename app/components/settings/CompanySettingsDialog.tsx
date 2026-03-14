"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, Search, Building2, Trash2, Eye, Pencil } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useState } from 'react'

interface Company {
  id: string
  name: string
  industry: string
  location: string
  employees: number
  status: 'active' | 'inactive'
  createdAt: string
}

const mockCompanies: Company[] = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology', location: 'New York, NY', employees: 250, status: 'active', createdAt: '2023-01-15' },
  { id: '2', name: 'Globex Industries', industry: 'Manufacturing', location: 'Chicago, IL', employees: 1200, status: 'active', createdAt: '2022-08-22' },
  { id: '3', name: 'Soylent Corp', industry: 'Food & Beverage', location: 'Los Angeles, CA', employees: 85, status: 'inactive', createdAt: '2023-05-10' },
  { id: '4', name: 'Initech LLC', industry: 'Software', location: 'Austin, TX', employees: 45, status: 'active', createdAt: '2023-11-03' },
]

interface CompanySettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CompanySettingsDialog({ open, onOpenChange }: CompanySettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)

  const activeCompanies = companies.filter(c => c.status === 'active')
  const filteredCompanies = activeCompanies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRemove = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id))
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
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-[#2B3A9F]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-[#2B3A9F]">
            <div className="p-2 rounded-lg bg-[#2B3A9F]/10">
              <Building2 className="w-6 h-6 text-[#2B3A9F]" />
            </div>
            Company Settings
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Manage your organizations, view details, and configure company settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B3A9F]" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[#2B3A9F] focus:ring-[#2B3A9F]/20"
              />
            </div>
            <Button className="bg-[#2B3A9F] hover:bg-[#2B3A9F]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Company
            </Button>
          </div>

          {/* Companies Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Companies
                    <Badge className="bg-[#2B3A9F]/10 text-[#2B3A9F] border-[#2B3A9F]/20 hover:bg-[#2B3A9F]/20">
                      {activeCompanies.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Active organizations in your system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-[#2B3A9F] font-semibold">Company</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Industry</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Location</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Employees</TableHead>
                    <TableHead className="text-[#2B3A9F] font-semibold">Created</TableHead>
                    <TableHead className="w-[100px] text-[#2B3A9F] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Building2 className="w-8 h-8 text-slate-300" />
                          <p>No companies found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id} className="hover:bg-[#2B3A9F]/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2B3A9F]/10 flex items-center justify-center text-[#2B3A9F] font-bold text-sm">
                              {company.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{company.name}</span>
                              <span className="text-xs text-slate-500">ID: {company.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#2B3A9F]/30 text-[#2B3A9F]">
                            {company.industry}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {company.location}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {company.employees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {formatDate(company.createdAt)}
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
                                Edit Company
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(company.id)}
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