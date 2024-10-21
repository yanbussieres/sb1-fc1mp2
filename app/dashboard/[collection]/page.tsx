"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import AddEditDocumentDialog from '@/components/AddEditDocumentDialog'

export default function CollectionPage({ params }: { params: { collection: string } }) {
  const [documents, setDocuments] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  const fetchDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, params.collection))
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setDocuments(docs)
  }

  useEffect(() => {
    fetchDocuments()
  }, [params.collection])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, params.collection, id))
      await fetchDocuments()
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (document: any) => {
    setEditingDocument(document)
    setIsAddDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false)
    setEditingDocument(null)
  }

  const handleSave = async () => {
    await fetchDocuments()
    handleCloseDialog()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{params.collection}</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Document</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.id}</TableCell>
              <TableCell>{JSON.stringify(doc)}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(doc)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddEditDocumentDialog
        isOpen={isAddDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        collection={params.collection}
        document={editingDocument}
      />
    </div>
  )
}