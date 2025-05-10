import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Payroll } from '@/types/payroll';

const columns = [
    { name: "Período", key: "period" },
    { name: "Tipo de Nómina", key: "type" },
    { name: "Tipo de Contrato", key: "contract_type" },
    { name: "Estado", key: "status" },
    { name: "Salario Neto", key: "net" },
    { name: "", key: "actions" },
];

const StatusChip = ({ status }: { status: string }) => (
    <span className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
);

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ'
    }).format(amount);
};

interface EmployeePayrollsTableProps {
    payrolls: Payroll[];
    loading: boolean;
    onViewDetail: (payroll: Payroll) => void;
}

export default function EmployeePayrollsTable({ 
    payrolls, 
    loading, 
    onViewDetail,
}: EmployeePayrollsTableProps) {
    const groupedPayrolls: Record<string, Payroll[]> = [...payrolls]
        .sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime())
        .reduce((acc, payroll) => {
            const payrollDate = parseISO(payroll.period_end);
            const date = format(payrollDate, 'MMMM yyyy', { locale: es });

            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(payroll);
            return acc;
        }, {} as Record<string, Payroll[]>);

    if (loading) {
        return (
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="min-h-[550px]">
                            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                {column.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {[...Array(5)].map((_, index) => (
                                        <tr key={index} className="even:bg-gray-50">
                                            {columns.map((col) => (
                                                <td key={`${index}-${col.key}`} className="px-3 py-4 text-sm text-gray-900">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!payrolls.length) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center p-8 text-center bg-white border rounded-lg">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-12 h-12 text-gray-400 mb-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay nóminas disponibles</h3>
                <p className="text-sm text-gray-500">No se encontraron nóminas pagadas para mostrar.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {Object.entries(groupedPayrolls).map(([period, periodPayrolls]) => (
                            <div key={period} className="mb-6">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-semibold capitalize">{period}</h3>
                                </div>
                                <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {columns.map((column) => (
                                                <th
                                                    key={column.key}
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    {column.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {periodPayrolls.map((payroll) => (
                                            <tr key={payroll.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {`${format(parseISO(payroll.period_start), 'dd/MM/yyyy')} - ${format(parseISO(payroll.period_end), 'dd/MM/yyyy')}`}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {payroll.payroll_type.name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {payroll.employee.contract_type.name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <StatusChip status={payroll.status} />
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 font-semibold">
                                                    {formatCurrency(payroll.net_salary)}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <button
                                                        onClick={() => onViewDetail(payroll)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg 
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            strokeWidth={1.5} 
                                                            stroke="currentColor" 
                                                            className="w-5 h-5"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
                                                            />
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
