'use client';

import React, { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, lowUser } from "@/services/users";
import { getRoles } from "@/services/roles";
import { getContractTypes } from "@/services/contract-type";
import Toast from "@/components/ui/Toast";
import UsersModal from "@/components/users/UsersModal";
import { Backdrop, CircularProgress } from "@mui/material";
import UserEditModal from "@/components/users/UserEditModal";
import EmployeeEditModal from "@/components/users/employee/EmployeeEditModal";
import { editEmployee } from "@/services/employees";
import { toast } from "react-toastify";
import UsersTable from "@/components/users/UsersTable";

const title = "Usuarios";
const description = "Lista de usuarios registrados en el sistema.";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [contractTypes, setContractTypes] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalUserOpen, setIsModalUserOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isModalEmployeeOpen, setIsModalEmployeeOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [users, roles, contractTypes] = await Promise.all([
                    getUsers(),
                    getRoles(),
                    getContractTypes()
                ]);
    
                setUsers(users.data);
                setRoles(roles.data);
                setContractTypes(contractTypes.data);
            } catch (error) {
                Toast({
                    message: "Error al obtener los usuarios: " + error,
                    type: "error", position: "top-right"
                });
            } finally {
                setLoading(false);
            }
        };
    
        loadData();
    }, []);
    

    const handleAdd = () => {
        setIsModalOpen(true);
    }

    const handleSave = async (data: any) => {
        const { id } = data;
        try {
            setCreateUpdateLoading(true)
            if (id === null) await handleCreate(data);
            if (id !== null) await handleUpdate(data);
        } catch (error: any) {
            Toast({
                message: "Error al registrar al usuario: " + error,
                type: "error",
                position: "top-right"
            })
        }finally{
            setCreateUpdateLoading(false);
        }
    }
    
    const handleEdit = (id: number, type: string) => {
        const userToEdit = users.find((user) => user.id === id);
        setSelectedUser(userToEdit);
        if(type === 'empleado') {
            setSelectedEmployee(userToEdit.employee);
            setIsModalEmployeeOpen(true);
        }
        if(type === 'usuario') {
            setIsModalUserOpen(true);
        }
    }

    const handleDelete = (id: number) => {
        Toast({
            message: "¿Está seguro de dar de baja al usuario?",
            type: "question",
            position: "top-right",
            handleDelete: async (value: boolean) => {
                toast.dismiss();
                if (!value) {
                    return
                }
                try {
                    setCreateUpdateLoading(true);
                    const response = await lowUser(id);
                    setUsers((prev) => prev.map((user) => user.id === id ? response.data : user));                    Toast({
                        message: "Usuario dado de baja correctamente",
                        type: "success",
                        position: "top-right"
                    });
                } catch (error) {
                    Toast({
                        message: "Error al dar de baja al usuario: " + error,
                        type: "error",
                        position: "top-right"
                    });
                }finally{
                    setCreateUpdateLoading(false);
                }
            }
        })
    }

    const handleCreate = async (data: any) => {
        const response = await createUser(data);
        setUsers((prev) => [...prev, response.data]);
        Toast({
            message: "Usuario creado correctamente",
            type: "success",
            position: "top-right"
        })
    }

    const handleUpdate = async (data: any) => {
        const response = await updateUser(data.id, data);
        setUsers((prev) => prev.map((user) => user.id === data.id ? response.data : user));
        Toast({
            message: "Usuario actualizado correctamente",
            type: "success",
            position: "top-right"
        });
       handleCloseModal();
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalUserOpen(false);
        setIsModalEmployeeOpen(false);
        setSelectedUser(null);
        setSelectedEmployee(null);
    };

    const handleEditEmployee = async (data: any) => {
        try {
            const dataEmployee = {
                dpi: data.dpi,
                nit: data.nit,
                position: data.position,
                salary: data.salary,
                contract_type_id: data.contract_type_id,
            }

            const response = await editEmployee(selectedEmployee.id, dataEmployee);
            setUsers((prev) => prev.map((user) => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        employee: {
                            ...user.employee,
                            ...response.data
                        }
                    };
                }
                return user;
            }));
            Toast({
                message: "Empleado editado correctamente",
                type: "success",
                position: "top-right"
            })

        } catch (error: any) {
            Toast({
                message: "Error al editar el empleado: " + error,
                type: "error",
                position: "top-right"
            })
        }finally{
            setCreateUpdateLoading(false);
        }
        handleCloseModal();
    }

    return (
        <>
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
                    
                    <UsersTable 
                        users={users}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            <UsersModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                user={null}
                roles={roles}
                contractTypes={contractTypes}
            />

            <UserEditModal
                isOpen={isModalUserOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                user={selectedUser}
                roles={roles}
            />

            <EmployeeEditModal
                isOpen={isModalEmployeeOpen}
                onClose={handleCloseModal}
                onSave={handleEditEmployee}
                employee={selectedEmployee}
                contractTypes={contractTypes}
            />

            {createUpdateLoading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>   
            )}
        </>
        
    );
}