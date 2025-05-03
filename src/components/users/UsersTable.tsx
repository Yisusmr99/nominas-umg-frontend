import { PencilIcon, UserCircleIcon, UserMinusIcon } from "@heroicons/react/24/outline";

const columns = [
    { name: "Nombre de usuario", nameFile: "username" },
    { name: "Nombre", nameFile: "name" },
    { name: "Apellido", nameFile: "last_name" },
    { name: "Email", nameFile: "email" },
    { name: "Rol", nameFile: "role.name" },
    { name: "Activo", nameFile: "is_active" },
];

function getNestedValue(obj: any, key: string) {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

const StatusChip = ({ isActive }: { isActive: boolean }) => (
    <span
        className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium w-10
            ${isActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
    >
        {isActive ? 'Sí' : 'No'}
    </span>
);

interface UsersTableProps {
    users: any[];
    loading: boolean;
    onEdit: (id: number, type: string) => void;
    onDelete: (id: number) => void;
}

export default function UsersTable({ users, loading, onEdit, onDelete }: UsersTableProps) {
    return (
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
                                                    {col.nameFile === "is_active" ? (
                                                        <StatusChip isActive={getNestedValue(dato, col.nameFile) === 1} />
                                                    ) : (
                                                        getNestedValue(dato, col.nameFile) !== null 
                                                            ? getNestedValue(dato, col.nameFile) 
                                                            : "—"
                                                    )}
                                                </td>
                                            ))}
                                            <td className="py-4 text-center text-sm font-medium sm:pr-3">
                                                {dato.is_active === 1 && (
                                                    <>
                                                        {dato.employee && (
                                                            <>
                                                                <div className="relative inline-block group">
                                                                    <UserCircleIcon 
                                                                        className="h-4.5 w-4.5 text-purple-700 font-medium text-center inline-flex items-center cursor-pointer" 
                                                                        aria-hidden="true"
                                                                        onClick={() => onEdit(dato.id, 'empleado')} 
                                                                    />
                                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                        Editar empleado
                                                                    </div>
                                                                </div>
                                                                &nbsp;&nbsp;&nbsp;
                                                            </>
                                                        )}
                                                        <div className="relative inline-block group">
                                                            <PencilIcon 
                                                                className="h-5 w-5 text-blue-700 font-medium text-center inline-flex items-center cursor-pointer" 
                                                                aria-hidden="true"
                                                                onClick={() => onEdit(dato.id, 'usuario')} 
                                                            />
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                Editar usuario
                                                            </div>
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;
                                                        <div className="relative inline-block group">
                                                            <UserMinusIcon
                                                                className="h-4.5 w-4.5 text-red-700 font-medium text-center inline-flex items-center cursor-pointer"
                                                                onClick={() => onDelete(dato.id)}
                                                                aria-hidden="true" 
                                                            />
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                Dar de baja
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
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
    );
}