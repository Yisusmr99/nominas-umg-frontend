'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { 
  ChevronDownIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon, ReceiptPercentIcon, UserGroupIcon,
  DocumentPlusIcon, DocumentChartBarIcon, PresentationChartLineIcon,
  RocketLaunchIcon
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { logout } from '@/services/auth'
import { hasAccess } from '@/middleware/roleMiddleware';
import { User } from '@/types/auth';
import { Tooltip } from '@mui/material'

const navigationItems = [
  { name: 'Nóminas', href: '/payrolls', icon: DocumentPlusIcon },
  { name: 'Pagos de nómina', href: '/payments', icon: ReceiptPercentIcon },
  { name: 'Usuarios', href: '/users', icon: UserGroupIcon },
  { name: 'Reportes', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Evaluaciones de desempeño', href: '/performance-evaluations', icon: PresentationChartLineIcon },
  { name: 'Vacaiones', href: '/vacations', icon: RocketLaunchIcon },
  { name: 'Deducciones', href: '/deductions', icon: ArrowTrendingDownIcon },
  { name: 'Bonos', href: '/bonus', icon: ArrowTrendingUpIcon },
  { name: 'Tipos de contrato', href: '/contract-types', icon: ClipboardDocumentCheckIcon },
  { name: 'Tipos de nómina', href: '/payroll-types', icon: ReceiptPercentIcon },
]

interface MainLayoutProps {
  children: React.ReactNode
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navigation = useMemo(() => navigationItems
    .filter(item => mounted ? hasAccess(item.href) : false) // Return empty while not mounted
    .map(item => ({
      ...item,
      current: pathname === item.href
    })), [pathname, mounted])

  useEffect(() => {
    setMounted(true)
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error during logout:', error)
      router.push('/auth/login')
    }
  }

  const userNavigation = [
    { name: 'Sign out', onClick: handleSignOut },
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              {/* Mobile Sidebar */}
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Mobile Navigation */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100 * 2}
                    height={100 * 1.5}
                    className="mx-auto h-16 w-auto"
                    priority
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="-mx-2 space-y-1">
                    {mounted && navigation.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? 'text-indigo-600'
                                : 'text-gray-400 group-hover:text-indigo-600',
                              'size-6 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop Sidebar */}
        <div className={classNames(
          'fixed inset-y-0 z-50 flex flex-col transition-all duration-300',
          desktopSidebarOpen ? 'w-72' : 'w-16',
          'hidden lg:flex'
        )}>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            {desktopSidebarOpen && (
              <div className="flex h-16 shrink-0 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={100 * 2}
                  height={100 * 1.5}
                  className="mx-auto h-16 w-auto"
                  priority
                />
              </div>
            )}
            <nav className={classNames(
              "flex flex-1 flex-col",
              !desktopSidebarOpen && "pt-4"
            )}>
              <ul role="list" className={classNames(
                "-mx-2 space-y-1",
                !desktopSidebarOpen && "-ml-4"
              )}>
                {mounted && navigation.map((item) => (
                  <li key={item.href}>
                    {!desktopSidebarOpen ? (
                      <Tooltip title={item.name} arrow placement="right">
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                            'group flex items-center rounded-md p-2 text-sm leading-6 font-semibold',
                            'justify-center w-10'
                          )}
                        >
                          {item.icon && (
                            <item.icon
                              className={classNames(
                                item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex items-center rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className={classNames(
                              item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        )}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={classNames(
          'transition-all duration-300',
          desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-16',
          'min-h-screen flex flex-col'
        )}>
          {/* Header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Desktop menu button */}
            <button type="button" onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)} className="-m-2.5 p-2.5 text-gray-700 hidden lg:block">
              <span className="sr-only">Toggle sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt="Profile picture"
                      src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                      width={32}
                      height={32}
                      className="rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm/6 font-semibold text-gray-900">
                        {user ? `${user.name} ${user.last_name}` : ''}
                      </span>
                      <ChevronDownIcon className="ml-2 size-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <button
                          onClick={item.onClick}
                          className="block w-full px-3 py-1 text-sm/6 text-gray-900 text-left cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 py-10" style={{ height: 'calc(100vh - 350px)' }}>
            <div className="px-4 sm:px-6 lg:px-8 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}