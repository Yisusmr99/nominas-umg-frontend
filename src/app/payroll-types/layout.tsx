import { MainLayout } from '@/components/layouts/MainLayout'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Nómina",
};

export default function PayrollTypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}