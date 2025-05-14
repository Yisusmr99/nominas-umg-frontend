'use client'
import React, { useEffect, useState } from 'react'
import { getPerformanceEvaluation, createPerformanceEvaluation } from '@/services/performance_evaluation'
import Toast from '@/components/ui/Toast';
import PerformanceEvaluationsTable from '@/components/performance/PerformanceEvaluationsTable';
import PerformanceEvaluationModal from '@/components/performance/PerformanceEvaluationModal';
import { PerformanceEvaluation } from '@/types/performance';
import { TextField } from '@mui/material';
import { MenuItem } from '@mui/material';
import { getEmployees } from '@/services/employees';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extender dayjs con los plugins necesarios
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const title = "Evaluaciones de Desempeño";
const description = "Lista de evaluaciones de desempeño de los empleados";

export default function PerformanceEvaluationsPage() {
    const [dataEvaluations, setDataEvaluations] = React.useState<PerformanceEvaluation[]>([]);
    const [filteredEvaluations, setFilteredEvaluations] = useState<PerformanceEvaluation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<string>('');
    const [employees, setEmployees] = useState<any[]>([]);
    const [periodStart, setPeriodStart] = useState<Dayjs | null>(dayjs().startOf('year'));
    const [periodEnd, setPeriodEnd] = useState<Dayjs | null>(dayjs().endOf('month'));
    const [user, setUser] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            let response = [] as any;
            if (selectedEmployee === "") {
                response = await getPerformanceEvaluation();
            }else{
                response = await getPerformanceEvaluation({employee_id: selectedEmployee});
            }
            setDataEvaluations(response.data);
        } catch (error: any) {
            Toast({
                message: "Error al cargar las evaluaciones de desempeño: " + error,
                type: "error",
                position: "top-right"
            });
        }finally {
            setLoading(false);
        }
    }

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            await createPerformanceEvaluation(data);
            Toast({
                message: "Evaluación creada exitosamente",
                type: "success",
                position: "top-right"
            });
            fetchData();
        } catch (error: any) {
            Toast({
                message: "Error al crear la evaluación: " + error,
                type: "error",
                position: "top-right"
            });
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees({});
            setEmployees(response.data);
        } catch (error) {
            Toast({
                message: "Error al cargar los empleados: " + error,
                type: "error",
                position: "top-right"
            });
        }
    };

    // Función para filtrar las evaluaciones
    const filterEvaluations = () => {
        let filtered = [...dataEvaluations];
        
        if (periodStart) {
            filtered = filtered.filter(evaluation => 
                dayjs(evaluation.start_period).isSameOrAfter(periodStart, 'day')
            );
        }
        
        if (periodEnd) {
            filtered = filtered.filter(evaluation => 
                dayjs(evaluation.end_period).isSameOrBefore(periodEnd, 'day')
            );
        }

        setFilteredEvaluations(filtered);
    };

    // UseEffect para cargar empleados (solo una vez al montar)
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Modificar el useEffect que obtiene el usuario
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            
            // Si es empleado, establecer su ID como filtro
            if (userData.role.id === 2 && userData.employee?.id) {
                setSelectedEmployee(userData.employee.id.toString());
            }
        }
    }, []);

    // Modificar el useEffect que llama a fetchData para que dependa también del usuario
    useEffect(() => {
        if (user) { // Solo ejecutar fetchData cuando tengamos la información del usuario
            fetchData();
        }
    }, [selectedEmployee, user]);

    // UseEffect para aplicar los filtros cuando cambien las fechas o los datos
    useEffect(() => {
        filterEvaluations();
    }, [dataEvaluations, periodStart, periodEnd]);

    const handleEmployeeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedEmployee(event.target.value as string);
    };

    const isAdmin = user?.role.id === 1;

    return (
        <>
            <div className="container mx-auto bg-white h-full flex flex-col">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">{ title }</h1>
                            <p className="mt-2 text-sm text-gray-700">
                            { description }
                            </p>
                        </div>
                        {isAdmin && (
                            <div className="mt-4 sm:mt-0">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    onClick={handleAdd}
                                >
                                    Agregar
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha inicial"
                                value={periodStart}
                                onChange={(newValue: Dayjs | null) => setPeriodStart(newValue)}
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        fullWidth: true
                                    } 
                                }}
                            />
                            <DatePicker
                                label="Fecha final"
                                value={periodEnd}
                                onChange={(newValue: Dayjs | null) => setPeriodEnd(newValue)}
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        fullWidth: true
                                    } 
                                }}
                            />
                        </LocalizationProvider>
                        {isAdmin && (
                            <TextField
                                select
                                name="employee_id"
                                label="Filtrar por empleado"
                                value={selectedEmployee}
                                onChange={handleEmployeeChange}
                                size="small"
                                fullWidth
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id.toString()}>
                                        {employee.user.name} {employee.user.last_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </div>
                    <div className="mt-4">
                        <PerformanceEvaluationsTable 
                            evaluations={filteredEvaluations}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
            {isAdmin && (
                <PerformanceEvaluationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    )
}