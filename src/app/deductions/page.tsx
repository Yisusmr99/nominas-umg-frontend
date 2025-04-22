'use client';

import React, { useState, useEffect } from "react";

import Table from "@/components/ui/table";
import { createDeduction, deleteDeduction, getDeductions, updateDeduction } from "@/services/deduction";
import { toast } from "react-toastify";
import Toast from "@/components/ui/Toast";
import { Backdrop, CircularProgress } from "@mui/material";
import DeductionsModal from "@/components/deductions/DeductionsModal";

const columns = [
    { name: "Nombre", nameFile: "deduction_name", },
    { name: "Porcentaje de la deducción", nameFile: "deduction_percentage", },
    { name: "Monto fijo", nameFile: "deduction_fixed_amount", },
];

export default function DeductionPage() {

    const [deductions, setDeductions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    const [selectedDeduction, setSelectedDeduction] = useState<any>(null);

    useEffect(() => {
        const fetchBonuses = async () => {
            try {
                const data = await getDeductions();
                setDeductions(data.data);
            } catch (error) {
                console.error("Error fetching bonuses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBonuses();
    }, []);

    const handleAdd = () => {
        setSelectedDeduction(null);
        setIsModalOpen(true);
    }

    const handleEdit = (id: number) => {
        const deductionToEdit = deductions.find((deduction) => deduction.id === id);
        setSelectedDeduction(deductionToEdit);
        setIsModalOpen(true);
    }

    const handleDelete = (id: number) => {
        Toast({
            message: "¿Estás seguro de eliminar esta deducción?",
            type: "question",
            position: "top-right",
            handleDelete: async (value: boolean) => {
                toast.dismiss();
                if (value) {
                    try {
                        await deleteDeduction(id);
                        setDeductions((prevDeductions) =>
                            prevDeductions.filter((deduction) => deduction.id !== id)
                        );
                        Toast({ 
                            message: "Deducción eliminada correctamente", 
                            type: "success", position: "top-right" 
                        });
                    } catch (error) {
                        Toast({ 
                            message: "Error al eliminar la deducción: " + error, 
                            type: "error", position: "top-right" 
                        });
                    }
                }
            }
        });

    }

    const handleSave = async (data: any) => {
        const { id } = data;
        try {
            setCreateUpdateLoading(true);
            if( id !== null ) await handleUpdate(data);
            if( id === null ) await handleCreate(data);

        } catch (error: any) {
            Toast({
                message: "Error al guardar la deducción: " + error.message,
                type: "error",
                position: "top-right"
            });
        }finally{
            setCreateUpdateLoading(false);
        }
    }

    const handleUpdate = async (data: any) => {
        const response = await updateDeduction(data.id, data);
        setDeductions((prevDeductions) =>
            prevDeductions.map((deduction) => (deduction.id === data.id ? response.data : deduction))
        );
        Toast({ 
            message: "Deducción actualizada correctamente", 
            type: "success", position: "top-right" 
        });
    }

    const handleCreate = async (data: any) => {
        const response = await createDeduction(data);
        setDeductions((prevDeductions) => [...prevDeductions, response.data]);
        Toast({ 
            message: "Deducción creada correctamente", 
            type: "success", position: "top-right" 
        });
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCreateUpdateLoading(false);
    }

    return (
        <>
            <Table
                loading={loading}
                data={deductions}
                title="Deducciones"
                description="Lista de deducciones disponibles en el sistema."
                columns={columns}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <DeductionsModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                deduction={selectedDeduction}
            />
            {createUpdateLoading && (
                <Backdrop open={createUpdateLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>
    );
}