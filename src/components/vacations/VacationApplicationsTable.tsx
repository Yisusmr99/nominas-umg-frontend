import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const columns = [
    { name: "Empleado", key: "employee" },
    { name: "Días solicitados", key: "days" },
    { name: "Estado", key: "status" },
    { name: "Fecha de solicitud", key: "created_at" },
];

const StatusChip = ({ status }: { status: any }) => {
    let className = "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ";
    let text = "";

    switch (status) {
        case 'pendiente':
            className += "bg-yellow-100 text-yellow-700";
            text = "Pendiente";
            break;
        case 'aprobado':
            className += "bg-green-100 text-green-700";
            text = "Aprobada";
            break;
        case 'rechazado':
            className += "bg-red-100 text-red-700";
            text = "Rechazada";
            break;
        default:
            className += "bg-gray-100 text-gray-700";
            text = "Desconocido";
    }

    return <span className={className}>{text}</span>;
};

interface VacationApplicationsTableProps {
    applications: any[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    isAdmin: boolean;
}

export default function VacationApplicationsTable({ 
    applications, 
    loading,
    onApprove,
    onReject,
    isAdmin
}: VacationApplicationsTableProps) {
    if (loading) {
        return (
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="min-h-[550px]">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.key} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {column.name}
                                            </th>
                                        ))}
                                        {isAdmin && <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Acciones</th>}
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
                                            {isAdmin && (
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                            )}
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
                    <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        {column.name}
                                    </th>
                                ))}
                                {isAdmin && <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {applications.map((application) => (
                                <tr key={application.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-4 text-sm text-gray-900">
                                        {`${application.employee.user.name} ${application.employee.user.last_name}`}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-900">
                                        {application.total_days}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-900">
                                        <StatusChip status={application.status} />
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-900">
                                        {format(parseISO(application.created_at), 'dd/MM/yyyy', { locale: es })}
                                    </td>
                                    {isAdmin && application.status === 'pendiente' && (
                                        <td className="py-4 text-center text-sm font-medium sm:pr-3">
                                            <div className="relative inline-block group">
                                                <CheckIcon 
                                                    className="
                                                        h-5 w-5 text-green-700 font-medium
                                                        text-center inline-flex items-center
                                                        cursor-pointer 
                                                    " 
                                                    aria-hidden="true"
                                                    onClick={() => onApprove(application.id)} 
                                                />
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                    Aprobar
                                                </div>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div className="relative inline-block group">
                                                <XMarkIcon 
                                                    className="
                                                        h-5 w-5 text-red-700 font-medium
                                                        text-center inline-flex items-center
                                                        cursor-pointer 
                                                    " 
                                                    aria-hidden="true"
                                                    onClick={() => onReject(application.id)} 
                                                />
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                    Rechazar
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
