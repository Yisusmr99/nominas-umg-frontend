import AuthGuard from '@/components/auth/AuthGuard'
import MainLayout  from '@/components/layouts/MainLayout'

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  )
}