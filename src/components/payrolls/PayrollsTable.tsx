import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const columns = [
    { name: "", key: "select" },
    { name: "Empleado", key: "employee" },
    { name: "Período", key: "period" },
    { name: "Tipo de Nómina", key: "type" },
    { name: "Tipo de Contrato", key: "contract_type" },
    { name: "Estado", key: "status" },
    { name: "Salario Neto", key: "net" },
    { name: "", key: "actions" },
];

const StatusChip = ({ status }: { status: string }) => (
    <span
        className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium
            ${status === 'pendiente' 
                ? 'bg-yellow-100 text-yellow-700' 
                : status === 'pagado'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
    >
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
);

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ'
    }).format(amount);
};

interface PayrollsTableProps {
    payrolls: any[];
    loading: boolean;
    onPaySelected: (payrollIds: number[]) => void;
    selectedPayrolls: number[];
    onSelectPayroll: (payrollId: number, checked: boolean) => void;
    onViewDetail: (payroll: any) => void;
    showActions: boolean;
}

export default function PayrollsTable({ 
    payrolls, 
    loading, 
    onPaySelected,
    selectedPayrolls,
    onSelectPayroll,
    onViewDetail,
    showActions
}: PayrollsTableProps) {
    const groupedPayrolls: Record<string, any[]> = [...payrolls]
        .sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime())
        .reduce((acc, payroll) => {
            const payrollDate = parseISO(payroll.period_end); // ✅ usa parseISO aquí
            const date = format(payrollDate, 'MMMM yyyy', { locale: es }); // resultado consistente

            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(payroll);
            return acc;
        }, {} as Record<string, any[]>);

    const handleSelectAllInPeriod = (periodPayrolls: any[], checked: boolean) => {
        periodPayrolls.forEach(payroll => {
            if (payroll.status === 'pendiente') {
                onSelectPayroll(payroll.id, checked);
            }
        });
    };

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

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {Object.entries(groupedPayrolls).map(([period, periodPayrolls]) => (
                            <div key={period} className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold capitalize">{period}</h3>
                                    {showActions && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onPaySelected(periodPayrolls.filter(p => selectedPayrolls.includes(p.id)).map(p => p.id))}
                                                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                                                    selectedPayrolls.some(id => periodPayrolls.map(p => p.id).includes(id))
                                                    ? 'bg-green-600 hover:bg-green-500'
                                                    : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                                disabled={!selectedPayrolls.some(id => periodPayrolls.map(p => p.id).includes(id))}
                                            >
                                                Pagar seleccionados
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {showActions && (
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300"
                                                        onChange={(e) => handleSelectAllInPeriod(periodPayrolls, e.target.checked)}
                                                        checked={periodPayrolls.every(p => p.status === 'pendiente' && selectedPayrolls.includes(p.id))}
                                                    />
                                                </th>
                                            )}
                                            {columns.slice(1).map((column) => (
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
                                                {showActions && (
                                                    <td className="px-3 py-4 text-sm text-gray-900">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300"
                                                            checked={selectedPayrolls.includes(payroll.id)}
                                                            onChange={(e) => onSelectPayroll(payroll.id, e.target.checked)}
                                                            disabled={payroll.status !== 'pendiente'}
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {`${payroll.employee.user.name} ${payroll.employee.user.last_name}`}
                                                </td>
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