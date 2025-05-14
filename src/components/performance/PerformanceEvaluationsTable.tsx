import { format, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { PerformanceEvaluation } from '@/types/performance';

const columns = [
    { name: "Empleado", key: "employee" },
    { name: "Período", key: "period" },
    { name: "Calidad de trabajo", key: "quality" },
    { name: "Logro de objetivos", key: "objectives" },
    { name: "Responsabilidad", key: "responsibility" },
    { name: "Trabajo en equipo", key: "teamwork" },
    { name: "Proactividad", key: "proactivity" },
    { name: "Nota final", key: "final" },
];

interface PerformanceEvaluationsTableProps {
    evaluations: PerformanceEvaluation[];
    loading: boolean;
}

export default function PerformanceEvaluationsTable({ 
    evaluations, 
    loading 
}: PerformanceEvaluationsTableProps) {
    const groupedEvaluations: Record<string, PerformanceEvaluation[]> = [...evaluations]
        .sort((a, b) => new Date(b.start_period).getTime() - new Date(a.start_period).getTime())
        .reduce((acc, evaluation) => {
            const evaluationDate = parseISO(evaluation.end_period);

            const date = format(evaluationDate, 'MMMM yyyy', { locale: es });

            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(evaluation);
            return acc;
        }, {} as Record<string, PerformanceEvaluation[]>);

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
                                            <th key={column.key} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
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

    if (!evaluations.length) {
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones disponibles</h3>
                <p className="text-sm text-gray-500">No se encontraron evaluaciones de desempeño para mostrar.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {Object.entries(groupedEvaluations).map(([period, periodEvaluations]) => (
                            <div key={period} className="mb-6">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-semibold capitalize">{period}</h3>
                                </div>
                                <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {columns.map((column) => (
                                                <th key={column.key} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    {column.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {periodEvaluations.map((evaluation) => (
                                            <tr key={evaluation.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.employee.user.name} {evaluation.employee.user.last_name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {`${format(addDays(parseISO(evaluation.start_period), 1), 'dd/MM/yyyy')} - ${format(addDays(parseISO(evaluation.end_period), 1), 'dd/MM/yyyy')}`}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.quality_of_work}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.achievement_of_objectives}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.responsibility}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.teamwork_communication}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    {evaluation.proactivity}
                                                </td>
                                                <td className="px-3 py-4 text-sm font-semibold text-gray-900">
                                                    {evaluation.final_note}
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