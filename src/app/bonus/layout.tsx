'use client'
import MainLayout  from '@/components/layouts/MainLayout'
import AuthGuard from '@/components/auth/AuthGuard'

export default function BonusLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  )
}