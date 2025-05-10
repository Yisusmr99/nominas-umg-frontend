'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { hasAccess } from '@/middleware/roleMiddleware'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return false
      }

      const isAllowed = hasAccess(pathname)
      if (!isAllowed) {
        router.push('/dashboard')
        return false
      }

      return true
    }

    setIsAuthorized(checkAuth())
  }, [pathname, router])

  // Render children only if authorized
  return isAuthorized ? children : null
}