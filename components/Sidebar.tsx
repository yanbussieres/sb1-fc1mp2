"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [collections, setCollections] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionsSnapshot = await getDocs(collection(db, '__collections__'))
      const collectionNames = collectionsSnapshot.docs.map(doc => doc.id)
      setCollections(collectionNames)
    }

    fetchCollections()
  }, [])

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li>
            <Link href="/dashboard" className={cn(
              "block py-2 px-4 rounded hover:bg-gray-700",
              pathname === "/dashboard" && "bg-gray-700"
            )}>
              Dashboard
            </Link>
          </li>
          {collections.map((collectionName) => (
            <li key={collectionName}>
              <Link href={`/dashboard/${collectionName}`} className={cn(
                "block py-2 px-4 rounded hover:bg-gray-700",
                pathname === `/dashboard/${collectionName}` && "bg-gray-700"
              )}>
                {collectionName}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}