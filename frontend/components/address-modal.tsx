'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { X, Trash2, Edit2 } from 'lucide-react'

interface Address {
  id: number
  name: string
  fullName: string
  phone: string
  address: string
  ward: string
  district: string
  city: string
  isDefault: boolean
}

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addresses: Address[]
  onAddressesChange: (addresses: Address[]) => void
}

export function AddressModal({
  open,
  onOpenChange,
  addresses,
  onAddressesChange,
}: AddressModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Address>({
    id: 0,
    name: '',
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  })

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      id: Date.now(),
      name: '',
      fullName: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: 'TP. Hồ Chí Minh',
      isDefault: false,
    })
  }

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id)
    setFormData(addr)
  }

  const handleSave = () => {
    if (editingId) {
      // Update existing
      const updated = addresses.map((addr) =>
        addr.id === editingId ? formData : addr
      )
      onAddressesChange(updated)
    } else {
      // Add new
      onAddressesChange([...addresses, formData])
    }
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    onAddressesChange(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefault = (id: number) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }))
    onAddressesChange(updated)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý địa chỉ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Addresses */}
          {editingId === null && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Danh sách địa chỉ</h3>
                <Button onClick={handleAddNew} className="rounded-full px-4">
                  + Thêm địa chỉ
                </Button>
              </div>

              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 border border-border rounded-lg flex justify-between items-start gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-muted-foreground">{addr.fullName}</p>
                    <p className="text-sm text-muted-foreground">{addr.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      {addr.address}, {addr.ward}, {addr.district}, {addr.city}
                    </p>
                    {addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded mt-2 cursor-pointer"
                      >
                        Địa chỉ mặc định
                      </button>
                    )}
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs border border-border px-2 py-1 rounded mt-2 hover:bg-muted cursor-pointer"
                      >
                        Đặt làm mặc định
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(addr)}
                      variant="outline"
                      size="icon"
                      className="rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(addr.id)}
                      variant="outline"
                      size="icon"
                      className="rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit/Add Form */}
          {editingId !== null && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                {editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="addr-name">Tên địa chỉ (vd: Nhà riêng, Văn phòng)</Label>
                  <Input
                    id="addr-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="addr-fullname">Họ và tên người nhận</Label>
                  <Input
                    id="addr-fullname"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="addr-phone">Số điện thoại</Label>
                  <Input
                    id="addr-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="addr-address">Địa chỉ</Label>
                  <Input
                    id="addr-address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="addr-ward">Phường/Xã</Label>
                    <Input
                      id="addr-ward"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="addr-district">Quận/Huyện</Label>
                    <Input
                      id="addr-district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="addr-city">Thành phố/Tỉnh</Label>
                  <Input
                    id="addr-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default-addr"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                  />
                  <Label htmlFor="default-addr" className="cursor-pointer">
                    Đặt làm địa chỉ mặc định
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {editingId !== null && (
            <Button
              variant="outline"
              onClick={() => setEditingId(null)}
              className="rounded-full"
            >
              Hủy
            </Button>
          )}
          {editingId === null && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Đóng
            </Button>
          )}
          {editingId !== null && (
            <Button
              onClick={handleSave}
              className="rounded-full"
            >
              Lưu địa chỉ
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
