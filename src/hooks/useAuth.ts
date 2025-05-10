import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Safe to access localStorage here
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return user
}
