"use client"

import { useState, useEffect } from 'react'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface AddEditDocumentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  collection: string
  document?: any
}

export default function AddEditDocumentDialog({
  isOpen,
  onClose,
  onSave,
  collection: collectionName,
  document,
}: AddEditDocumentDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (document) {
      setFormData(document)
    } else {
      setFormData({})
    }
  }, [document])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (document) {
        await updateDoc(doc(db, collectionName, document.id), formData)
      } else {
        await setDoc(doc(collection(db, collectionName)), formData)
      }
      toast({
        title: "Success",
        description: `Document ${document ? 'updated' : 'added'} successfully`,
      })
      onSave()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${document ? 'update' : 'add'} document`,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{document ? 'Edit' : 'Add'} Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            key !== 'id' && (
              <div key={key} className="mb-4">
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                />
              </div>
            )
          ))}
          <DialogFooter>
            <Button type="submit">{document ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}