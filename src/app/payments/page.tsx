'use client';
import { useEffect, useState } from 'react';
import PayrollDetailModal from '@/components/payrolls/PayrollDetailModal';
import { getByEmployee } from '@/services/payrolls';
import Toast from '@/components/ui/Toast';
import { Backdrop, CircularProgress, TextField } from '@mui/material';
import EmployeePayrollsTable from '@/components/payrolls/EmployeePayrollsTable';

const title = "Mis Nóminas";
const description = "Lista de nóminas pagadas.";

const getDefaultDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString().split('T')[0];
    return { firstDay, lastDay };
};

export default function PaymentsPage() {
    const { firstDay, lastDay } = getDefaultDates();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
    const [payrollsData, setPayrollsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [periodStart, setPeriodStart] = useState(firstDay);
    const [periodEnd, setPeriodEnd] = useState(lastDay);

    const handleViewDetail = (payroll: any) => {
        setSelectedPayroll(payroll);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedPayroll(null);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get user from localStorage
            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('Usuario no encontrado');
            }
            const user = JSON.parse(userString);
            
            const response = await getByEmployee(user.id, {
                period_start: periodStart,
                period_end: periodEnd
            });
            setPayrollsData(response.data);
        }
        catch (error) {
            Toast({
                message: "Error al obtener los datos: " + error,
                type: "error",
                position: "top-right"
            });
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [periodStart, periodEnd]);

    return (
        <>
            <div className="container mx-auto bg-white h-full flex flex-col">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="sm:flex sm:items-center justify-between">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                {description}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <TextField
                                type="date"
                                label="Fecha Inicio"
                                value={periodStart}
                                onChange={(e) => setPeriodStart(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <TextField
                                type="date"
                                label="Fecha Fin"
                                value={periodEnd}
                                onChange={(e) => setPeriodEnd(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </div>
                    </div>

                    <EmployeePayrollsTable 
                        payrolls={payrollsData}
                        loading={loading}
                        onViewDetail={handleViewDetail}
                    />
                </div>
            </div>

            <PayrollDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                payroll={selectedPayroll}
            />

            {loading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>   
            )}
        </>
    )
}