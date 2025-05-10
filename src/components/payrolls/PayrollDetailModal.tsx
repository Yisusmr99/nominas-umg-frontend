import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Payroll } from '@/types/payroll';

interface PayrollDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    payroll: Payroll | null;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ'
    }).format(amount);
};

export default function PayrollDetailModal({ isOpen, onClose, payroll }: PayrollDetailModalProps) {
    if (!payroll) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
        >
            <div className="flex items-center justify-between border-b">
                <DialogTitle className="text-lg font-semibold">
                    Detalle del pago de nómina
                </DialogTitle>
                <button
                    onClick={handleClose}
                    className="p-2 mr-2 hover:bg-gray-100 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <DialogContent className="!p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <table className="min-w-full divide-y divide-gray-300 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th colSpan={2} className="px-3 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                                        Información del Empleado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Nombre</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.employee.user.name} {payroll.employee.user.last_name}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">DPI</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.employee.dpi}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">NIT</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.employee.nit}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Puesto</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.employee.position}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Tipo de Contrato</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.employee.contract_type.name}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Salario Base</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(payroll.employee.salary)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="min-w-full divide-y divide-gray-300 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th colSpan={2} className="px-3 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                                        Información de la Nómina
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Tipo</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.payroll_type.name}</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Período</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                        {format(parseISO(payroll.period_start), 'dd/MM/yyyy')} - {format(parseISO(payroll.period_end), 'dd/MM/yyyy')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Estado</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}</td>
                                </tr>
                                {payroll.payment_date && (
                                    <tr>
                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Fecha de pago</td>
                                        <td className="px-3 py-2 text-sm text-gray-900">{format(parseISO(payroll.payment_date), 'dd/MM/yyyy')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <table className="min-w-full divide-y divide-gray-300 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th colSpan={2} className="px-3 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                                        Bonificaciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {payroll.payroll_bonu.map(bonus => (
                                    <tr key={bonus.id}>
                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 w-2/3">{bonus.bonus.bonu_name}</td>
                                        <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(bonus.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <table className="min-w-full divide-y divide-gray-300 border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th colSpan={2} className="px-3 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                                        Deducciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {payroll.payroll_deduction.map(deduction => (
                                    <tr key={deduction.id}>
                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 w-2/3">{deduction.deduction.deduction_name}</td>
                                        <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(deduction.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <table className="min-w-full divide-y divide-gray-300 border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th colSpan={2} className="px-3 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                                    Totales
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            <tr>
                                <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 w-1/4">Total Ingresos</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(payroll.total_income)}</td>
                            </tr>
                            <tr>
                                <td className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50">Total Deducciones</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(payroll.total_deductions)}</td>
                            </tr>
                            <tr>
                                <td className="px-3 py-2 text-base font-bold text-gray-900 bg-gray-50">Salario Neto</td>
                                <td className="px-3 py-2 text-base font-bold text-gray-900">{formatCurrency(payroll.net_salary)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
