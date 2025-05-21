'use client';
import React, { useEffect, useState } from 'react'
import { getApplications, approveApplication, 
    getApplicationByEmployee, storeAplication, addVacationAllEmployees,
    getVacationBalance, declineVacation
} from '@/services/vacation'
import Toast from '@/components/ui/Toast';
import VacationApplicationsTable from '@/components/vacations/VacationApplicationsTable';
import VacationRequestModal from '@/components/vacations/VacationRequestModal';
import { Backdrop, CircularProgress } from '@mui/material';

const title = "Solicitudes de Vacaciones";
let description = "Lista de solicitudes de vacaciones de los empleados";

export default function VacationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableDays, setAvailableDays] = useState(0);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [addingVacations, setAddingVacations] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getApplications();
            setApplications(response.data);
        } catch (error: any) {
            Toast({
                message: "Error al cargar las solicitudes: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setLoading(false);
        }
    };
    
    const fetchEmployeeData = async (employeeId: number) => {
        try {
            setLoading(true);
            const response = await getApplicationByEmployee(employeeId);
            setApplications(response.data);
            const balanceResponse = await getVacationBalance(employeeId);
            setAvailableDays(balanceResponse.data.available_days);
        } catch (error: any) {
            Toast({
                message: "Error al cargar las solicitudes del empleado: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (id: number) => {
        try {
            setActionLoading(true);
            await approveApplication(id);
            await fetchData();
            Toast({
                message: "Solicitud aprobada exitosamente",
                type: "success",
                position: "top-right"
            });
        } catch (error: any) {
            Toast({
                message: "Error al aprobar la solicitud: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id: number) => {
        try {
            setActionLoading(true);
            await declineVacation(id);
            await fetchData();
            Toast({
                message: "Solicitud rechazada exitosamente",
                type: "success",
                position: "top-right"
            });
        }catch (error: any) {
            Toast({
                message: "Error al rechazar la solicitud: " + error,
                type: "error",
                position: "top-right"
            });
        }finally{
            setActionLoading(false);
        }
    };

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            setActionLoading(true);
            await storeAplication({
                ...data,
                employee_id: user.employee.id
            });
            await fetchEmployeeData(user.employee.id);
            Toast({
                message: "Solicitud creada exitosamente",
                type: "success",
                position: "top-right"
            });
            setIsModalOpen(false);
        } catch (error: any) {
            Toast({
                message: "Error al crear la solicitud: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddVacationAllEmployees = async () => {
        try {
            setAddingVacations(true);
            await addVacationAllEmployees();
            await fetchData();
            Toast({
                message: "Vacaciones agregadas exitosamente a todos los empleados",
                type: "success",
                position: "top-right"
            });
        } catch (error: any) {
            Toast({
                message: "Error al agregar vacaciones: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setAddingVacations(false);
        }
    };

    const checkPendingApplications = (applications: any[]) => {
        return applications.some(app => app.status === 'pendiente');
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setAvailableDays(userData.employee?.vacation_balance?.available_days || 0);
            
            if(userData.id == 1) {
                fetchData();
            } else {
                description = "Lista de solicitudes de vacaciones";
                fetchEmployeeData(userData.employee.id);
            }
        }
    }, []);

    useEffect(() => {
        setHasPendingRequest(checkPendingApplications(applications));
    }, [applications]);

    return (
        <>
            <div className="container mx-auto bg-white h-full flex flex-col">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                            {loading ? (
                                <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3" />
                            ) : (
                                <p className="mt-2 text-sm text-gray-700">
                                    {description}
                                </p>
                            )}
                        </div>
                        {user?.role?.id === 1 && (
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <button
                                    type="button"
                                    className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:bg-gray-400"
                                    onClick={handleAddVacationAllEmployees}
                                    disabled={addingVacations}
                                >
                                    Agregar Vacaciones a Todos
                                </button>
                            </div>
                        )}
                        {user?.role?.id !== 1 && (
                            <div className="mt-4 sm:mt-0 sm:ml-16">
                                <button
                                    type="button"
                                    className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400"
                                    onClick={handleAdd}
                                    disabled={hasPendingRequest || availableDays === 0}
                                    title={
                                        hasPendingRequest 
                                            ? "Ya tienes una solicitud pendiente" 
                                            : availableDays === 0 
                                            ? "No tienes días disponibles" 
                                            : "Crear nueva solicitud"
                                    }
                                >
                                    Nueva Solicitud
                                </button>
                                <div className="text-sm text-gray-500 mt-2">
                                    Días disponibles: {availableDays}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <VacationApplicationsTable 
                            applications={applications}
                            loading={loading}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isAdmin={user?.role?.id === 1}
                        />
                    </div>
                </div>
            </div>

            <VacationRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                availableDays={availableDays}
            />

            <Backdrop open={actionLoading || addingVacations} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}