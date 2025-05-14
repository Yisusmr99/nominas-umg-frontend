'use client';
import { useEffect, useState } from 'react';
import PayrollModal from '@/components/payrolls/PayrollModal';
import PayrollDetailModal from '@/components/payrolls/PayrollDetailModal';
import PayrollsTable from '@/components/payrolls/PayrollsTable';
import { getPayrolls, createPayroll, payPayroll } from '@/services/payrolls';
import Toast from '@/components/ui/Toast';
import { Backdrop, CircularProgress, TextField, MenuItem, Tabs, Tab, Box } from '@mui/material';
import { getContractTypes } from '@/services/contract-type';

const title = "Nóminas";
const description = "Lista de nóminas registradas en el sistema.";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`payroll-tabpanel-${index}`}
            aria-labelledby={`payroll-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>{children}</Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `payroll-tab-${index}`,
        'aria-controls': `payroll-tabpanel-${index}`,
    };
}

export default function PayrollsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
    const [payrollsData, setPayrollsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    const [contractTypes, setContractTypes] = useState<any[]>([]);
    const [selectedContractType, setSelectedContractType] = useState<string>('');
    const [selectedPayrolls, setSelectedPayrolls] = useState<number[]>([]);
    const [tabValue, setTabValue] = useState(0);

    const handleAdd = () => {
        setSelectedPayroll(null);
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            setCreateUpdateLoading(true);
            const response = await createPayroll(data);
            if (Array.isArray(response.data)) {
                setPayrollsData(prevPayrolls => [...prevPayrolls, ...response.data]);
                Toast({
                    message: "Nóminas creadas exitosamente",
                    type: "success",
                    position: "top-right"
                });
            }
        } catch (error) {
            Toast({
                message: "Error al guardar la nómina: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setCreateUpdateLoading(false);
            setIsModalOpen(false);
        }
    };

    const handleContractTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedContractType(event.target.value as string);
    };

    const handleSelectPayroll = (payrollId: number, checked: boolean) => {
        setSelectedPayrolls(prev => 
            checked 
                ? [...prev, payrollId]
                : prev.filter(id => id !== payrollId)
        );
    };

    const handlePaySelected = async (payrollIds: number[]) => {
        if (!payrollIds.length) return;
        
        try {
            setCreateUpdateLoading(true);
            const data ={
                payrolls: payrollIds
            }
            await payPayroll(data);
            await fetchData();
            Toast({
                message: "Nóminas pagadas exitosamente",
                type: "success",
                position: "top-right"
            });
            setSelectedPayrolls([]);
            setSelectedContractType('');
        } catch (error) {
            Toast({
                message: "Error al pagar las nóminas: " + error,
                type: "error",
                position: "top-right"
            });
        } finally {
            setCreateUpdateLoading(false);
        }
    };

    const handleViewDetail = (payroll: any) => {
        setSelectedPayroll(payroll);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedPayroll(null);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSelectedPayrolls([]);
        setSelectedContractType('');
    };

    const filteredPayrolls = payrollsData.filter(payroll => 
        selectedContractType === '' || 
        payroll.employee.contract_type_id.toString() === selectedContractType
    );

    const pendingPayrolls = filteredPayrolls.filter(p => p.status === 'pendiente');
    const paidPayrolls = filteredPayrolls.filter(p => p.status === 'pagado');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [payrollsResponse, contractTypesResponse] = await Promise.all([
                getPayrolls(),
                getContractTypes()
            ]);
            setPayrollsData(payrollsResponse.data);
            setContractTypes(contractTypesResponse.data);
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
    }, []);

    return (
        <>
            <div className="container mx-auto bg-white h-full flex flex-col">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                {description}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-2">
                            <TextField
                                select
                                name="contract_type_id"
                                label="Filtrar por tipo de contrato"
                                value={selectedContractType}
                                onChange={handleContractTypeChange}
                                size="small"
                                sx={{ minWidth: 260 }}
                                SelectProps={{
                                    native: false
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {contractTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            
                            <button
                                type="button"
                                className="rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                onClick={handleAdd}
                            >
                                Crear nómina
                            </button>
                        </div>
                    </div>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            aria-label="payroll tabs"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                }
                            }}
                        >
                            <Tab 
                                label={`Pendientes (${pendingPayrolls.length})`} 
                                {...a11yProps(0)} 
                            />
                            <Tab 
                                label={`Pagadas (${paidPayrolls.length})`} 
                                {...a11yProps(1)} 
                            />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <PayrollsTable 
                            payrolls={pendingPayrolls}
                            loading={loading}
                            selectedPayrolls={selectedPayrolls}
                            onSelectPayroll={handleSelectPayroll}
                            onPaySelected={handlePaySelected}
                            onViewDetail={handleViewDetail}
                            showActions={true}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <PayrollsTable 
                            payrolls={paidPayrolls}
                            loading={loading}
                            selectedPayrolls={[]}
                            onSelectPayroll={() => {}}
                            onPaySelected={() => {}}
                            onViewDetail={handleViewDetail}
                            showActions={false}
                        />
                    </TabPanel>
                </div>
            </div>

            <PayrollModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                payroll={selectedPayroll}
            />

            <PayrollDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                payroll={selectedPayroll}
            />

            {createUpdateLoading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>   
            )}
        </>
    )
}