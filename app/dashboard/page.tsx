"use client"

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [collections, setCollections] = useState<string[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionsSnapshot = await getDocs(collection(db, '__collections__'))
      const collectionNames = collectionsSnapshot.docs.map(doc => doc.id)
      setCollections(collectionNames)

      const countPromises = collectionNames.map(async (collectionName) => {
        const querySnapshot = await getDocs(collection(db, collectionName))
        return { [collectionName]: querySnapshot.size }
      })

      const countResults = await Promise.all(countPromises)
      setCounts(Object.assign({}, ...countResults))
    }

    fetchCollections()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collectionName) => (
          <Card key={collectionName}>
            <CardHeader>
              <CardTitle>{collectionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{counts[collectionName] || 0} documents</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}