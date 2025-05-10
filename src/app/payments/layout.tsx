'use client'
import MainLayout from '@/components/layouts/MainLayout'
import AuthGuard from '@/components/auth/AuthGuard'

export default function PayrollTypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  )
}