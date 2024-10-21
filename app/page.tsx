import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-4xl font-bold text-white mb-8">Firestore Admin Panel</h1>
      <Link href="/login">
        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100">
          Login to Admin Panel
        </Button>
      </Link>
    </div>
  )
}