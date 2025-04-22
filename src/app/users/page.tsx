'use client';

import React, { useState, useEffect } from "react";
import { getUsers } from "@/services/users";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const columns = [
    { name: "Nombre de usuario", nameFile: "username" },
    { name: "Nombre", nameFile: "name" },
    { name: "Apellido", nameFile: "last_name" },
    { name: "Email", nameFile: "email" },
    { name: "Rol", nameFile: "role.name" }
];

const title = "Usuarios";
const description = "Lista de usuarios registrados en el sistema.";

// Add helper function for nested property access
function getNestedValue(obj: any, key: string) {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleAdd = () => {
        console.log("Agregar usuario");
    }
    
    const handleEdit = (id: number) => {
        console.log("Editar usuario con ID:", id);
    }

    const handleDelete = (id: number) => {
        console.log("Eliminar usuario con ID:", id);
    }

    return (
        <div className="container mx-auto bg-white h-full flex flex-col">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold text-gray-900">{ title }</h1>
                        <p className="mt-2 text-sm text-gray-700">
                           { description }
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="block rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={handleAdd}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="max-h-[600px] min-h-[550px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                <table className="min-w-full divide-y divide-gray-300 border-x border-b border-gray-300">
                                    <thead className="bg-white sticky top-0 z-10 shadow">
                                        <tr className="divide-x divide-gray-200">
                                            {columns.map((column, i) => (
                                                <th
                                                    key={column.name}
                                                    scope="col"
                                                    className={`py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3 bg-white ${i < columns.length - 1 ? 'border-r border-gray-300' : ''}`}
                                                >
                                                    {column.name}
                                                </th>
                                            ))}
                                            <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3 bg-white">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {loading ? (
                                            Array(columns.length).fill(0).map((_, index) => (
                                                <tr key={index} className="even:bg-gray-50 divide-x divide-slate-200">
                                                    {columns.map((col, i) => (
                                                        
                                                        <td key={col.nameFile} className={`px-3 py-4 text-sm text-gray-900 ${i < columns.length - 1 ? 'border-r border-gray-300' : ''}`}>
                                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                        </td>
                                                        
                                                    ))}
                                                    <td className="py-4 px-3">
                                                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            users.map((dato, index) => (
                                                <tr key={index} className="even:bg-gray-50 divide-x divide-slate-200">
                                                    {columns.map((col) => (
                                                        <td key={col.nameFile} className="px-3 py-4 text-sm text-gray-900">
                                                            {getNestedValue(dato, col.nameFile) !== null 
                                                                ? getNestedValue(dato, col.nameFile) 
                                                                : "—"}
                                                        </td>
                                                    ))}
                                                    <td className="py-4 text-center text-sm font-medium sm:pr-3">
                                                        <div className="relative inline-block group">
                                                            <PencilIcon 
                                                                className="
                                                                    h-5 w-5 text-blue-700 font-medium
                                                                    text-center inline-flex items-center
                                                                    cursor-pointer
                                                                " 
                                                                aria-hidden="true"
                                                                onClick={() => handleEdit(dato.id)} 
                                                            />
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                Editar
                                                            </div>
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;
                                                        <div className="relative inline-block group">
                                                            <TrashIcon
                                                                className="
                                                                    h-4.5 w-4.5 text-red-700 font-medium
                                                                    text-center inline-flex items-center
                                                                    cursor-pointer
                                                                "
                                                                onClick={() => handleDelete(dato.id)}
                                                                aria-hidden="true" 
                                                            />
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                Eliminar
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}