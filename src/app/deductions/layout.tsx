'use client'
import { MainLayout } from '@/components/layouts/MainLayout'

export default function DeductioLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}