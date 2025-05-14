'use client';
import { useEffect, useState } from 'react';
import PayrollDetailModal from '@/components/payrolls/PayrollDetailModal';
import EmployeePayrollsTable from '@/components/payrolls/EmployeePayrollsTable';
import { getReports, exportReport } from '@/services/reports';
import { getEmployees } from '@/services/employees';
import Toast from '@/components/ui/Toast';
import { TextField, MenuItem } from '@mui/material';
import { getContractTypes } from '@/services/contract-type';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const title = "Reportes de nómina";

export default function ReportsPage() {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
    const [payrollsData, setPayrollsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [contractTypes, setContractTypes] = useState<any[]>([]);
    const [selectedContractType, setSelectedContractType] = useState<string>('');
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [periodStart, setPeriodStart] = useState<Dayjs | null>(dayjs().startOf('year'));
    const [periodEnd, setPeriodEnd] = useState<Dayjs | null>(dayjs().endOf('month'));

    const handleContractTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedContractType(event.target.value as string);
    };

    const handleEmployeeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedEmployee(event.target.value as string);
    };

    const handleViewDetail = (payroll: any) => {
        setSelectedPayroll(payroll);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedPayroll(null);
    };

    const handleExport = () => {
        setExportLoading(true);
        exportReport({
            period_start: periodStart?.format('YYYY-MM-DD'),
            period_end: periodEnd?.format('YYYY-MM-DD'),
            ...(selectedEmployee && { employee_id: selectedEmployee })
        });
        setExportLoading(false);
    };

    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const payrollsResponse = await getReports({
                period_start: periodStart?.format('YYYY-MM-DD'),
                period_end: periodEnd?.format('YYYY-MM-DD'),
                ...(selectedEmployee && { employee_id: selectedEmployee }),
                ...(selectedContractType && { contract_type_id: selectedContractType })
            });
            setPayrollsData(payrollsResponse.data);
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
    };

    const fetchMasterData = async () => {
        try {
            const [contractTypesResponse, employeesResponse] = await Promise.all([
                getContractTypes(),
                getEmployees({})
            ]);
            setContractTypes(contractTypesResponse.data);
            setEmployees(employeesResponse.data);
        }
        catch (error) {
            Toast({
                message: "Error al obtener los datos maestros: " + error,
                type: "error",
                position: "top-right"
            });
        }
    };

    useEffect(() => {
        fetchMasterData();
    }, []); // This will run only once when component mounts

    useEffect(() => {
        fetchPayrollData();
    }, [periodStart, periodEnd, selectedEmployee, selectedContractType]);

    return (
        <>
            <div className="container mx-auto bg-white h-full flex flex-col">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
                            <button
                                type="button"
                                onClick={handleExport}
                                disabled={exportLoading}
                                className="rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
                            >
                                {exportLoading ? 'Exportando...' : 'Exportar'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha inicial"
                                value={periodStart}
                                onChange={(newValue: Dayjs | null) => setPeriodStart(newValue)}
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        sx: { minWidth: 200 }
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
                                        sx: { minWidth: 200 }
                                    } 
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            select
                            name="employee_id"
                            label="Filtrar por empleado"
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}
                            size="small"
                            sx={{ minWidth: 260 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id.toString()}>
                                    {employee.user.name} {employee.user.last_name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            name="contract_type_id"
                            label="Filtrar por tipo de contrato"
                            value={selectedContractType}
                            onChange={handleContractTypeChange}
                            size="small"
                            sx={{ minWidth: 260 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {contractTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className="mt-4">
                        <EmployeePayrollsTable 
                            payrolls={payrollsData}
                            loading={loading}
                            onViewDetail={handleViewDetail}
                        />
                    </div>
                </div>
            </div>

            <PayrollDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                payroll={selectedPayroll}
            />
        </>
    )
}