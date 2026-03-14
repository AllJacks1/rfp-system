"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, Search, CreditCard, Trash2, Eye, Pencil, Wallet, Smartphone, Banknote, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useState } from 'react'

interface PaymentMethod {
  id: string
  name: string
  type: 'Credit Card' | 'Digital Wallet' | 'Bank Transfer' | 'Cash' | 'Check'
  provider: string
  lastFour: string
  expiryDate?: string
  isDefault: boolean
  status: 'active' | 'inactive'
}

const mockMethods: PaymentMethod[] = [
  { id: '1', name: 'Corporate Visa', type: 'Credit Card', provider: 'Visa', lastFour: '4242', expiryDate: '12/25', isDefault: true, status: 'active' },
  { id: '2', name: 'Business Mastercard', type: 'Credit Card', provider: 'Mastercard', lastFour: '8888', expiryDate: '08/26', isDefault: false, status: 'active' },
  { id: '3', name: 'PayPal Business', type: 'Digital Wallet', provider: 'PayPal', lastFour: 'N/A', isDefault: false, status: 'active' },
  { id: '4', name: 'Stripe Account', type: 'Digital Wallet', provider: 'Stripe', lastFour: 'N/A', isDefault: false, status: 'active' },
  { id: '5', name: 'Wire Transfer', type: 'Bank Transfer', provider: 'ACH', lastFour: 'N/A', isDefault: false, status: 'active' },
  { id: '6', name: 'Petty Cash', type: 'Cash', provider: 'Internal', lastFour: 'N/A', isDefault: false, status: 'inactive' },
]

interface PaymentMethodsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaymentMethodsDialog({ open, onOpenChange }: PaymentMethodsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [methods, setMethods] = useState<PaymentMethod[]>(mockMethods)

  const activeMethods = methods.filter(m => m.status === 'active')
  const filteredMethods = activeMethods.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRemove = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Credit Card': return <CreditCard className="w-4 h-4" />
      case 'Digital Wallet': return <Smartphone className="w-4 h-4" />
      case 'Cash': return <Banknote className="w-4 h-4" />
      default: return <Wallet className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Credit Card': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'Digital Wallet': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Bank Transfer': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Cash': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'Check': return 'bg-amber-100 text-amber-700 border-amber-200'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-6 border-t-4 border-t-rose-600">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl flex items-center gap-2 text-rose-600">
            <div className="p-2 rounded-lg bg-rose-50">
              <CreditCard className="w-6 h-6 text-rose-600" />
            </div>
            Payment Methods
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Set up credit cards, digital wallets, and other payment methods.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600" />
              <Input
                placeholder="Search payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-rose-600 focus:ring-rose-600/20"
              />
            </div>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    Payment Methods
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200">
                      {activeMethods.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Active payment options for transactions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-rose-600 font-semibold">Method Name</TableHead>
                    <TableHead className="text-rose-600 font-semibold">Type</TableHead>
                    <TableHead className="text-rose-600 font-semibold">Provider</TableHead>
                    <TableHead className="text-rose-600 font-semibold">Details</TableHead>
                    <TableHead className="text-rose-600 font-semibold">Default</TableHead>
                    <TableHead className="w-[100px] text-rose-600 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMethods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <CreditCard className="w-8 h-8 text-slate-300" />
                          <p>No payment methods found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMethods.map((method) => (
                      <TableRow key={method.id} className="hover:bg-rose-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                              {getTypeIcon(method.type)}
                            </div>
                            <span className="font-medium text-slate-900">{method.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(method.type)}>
                            {method.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {method.provider}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {method.type === 'Credit Card' ? (
                            <div className="flex flex-col">
                              <span className="font-mono text-sm">**** {method.lastFour}</span>
                              <span className="text-xs text-slate-500">Exp: {method.expiryDate}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {method.isDefault ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0">
                              <Check className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-rose-100 hover:text-rose-600"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel className="text-xs text-slate-500">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-rose-50 hover:text-rose-600">
                                <Eye className="w-4 h-4 mr-2 text-rose-600" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer hover:bg-rose-50 hover:text-rose-600">
                                <Pencil className="w-4 h-4 mr-2 text-rose-600" />
                                Edit Method
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleRemove(method.id)}
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