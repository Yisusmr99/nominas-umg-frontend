'use client'; // Necesario para manejar eventos en el cliente
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; // Importar useRouter
import React, { useState } from 'react';
import { login } from '@/services/auth'; // Importar la función de login
import Image from 'next/image';
import Toast from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter(); // Instancia de useRouter
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    // Crear la promesa sin await
    const loginPromise = login({ email, password });
    setLoading(true);
    
    Toast({
      message: 'Validando credenciales...',
      type: 'promise',
      position: 'top-right',
      handleDelete: undefined,
      promise: loginPromise,
    });

    loginPromise.then((data) => {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);

      if(data.data.user.role.id === 1) {
        router.push('/payrolls')
      }else if(data.data.user.role.id === 2) {
        router.push('/payments')
      }else{
        router.push('/dashboard')
      }
      
    }).catch((error: any) => {
      console.error('Error during login:', error);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Columna del formulario */}
      <div className="flex flex-col justify-center w-full px-6 py-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100 * 1.5}
              height={100 * 1.5}
              className="mx-auto w-auto"
              priority
            />
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border py-2 px-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border py-2 px-3 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Columna de la imagen */}
      <div className="relative hidden lg:block w-1/2">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}