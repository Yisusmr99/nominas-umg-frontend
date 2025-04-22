/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from "react";
import Table from "@/components/ui/table";
import { Backdrop, CircularProgress } from "@mui/material";
import Toast from "@/components/ui/Toast";
import { toast } from "react-toastify";
import { 
    getPayrollTypes, createPayrollType,
    updatePayrollType, deletePayrollType
} from "@/services/payroll-type";
import PayrollTypeModal from "@/components/payroll-types/PayrollTypesModal";

const columns = [
    { name: "Nombre del tipo de nomina", nameFile: "name", },
];

export default function PayrollTypePage() {
    const [payrollTypes, setPayrollTypes] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    const [selectedPayrollType, setSelectedPayrollType] = useState<any>(null);

    useEffect(() => {
        const fetchPayrollTypes = async () => {
            try {
                const data = await getPayrollTypes();
                setPayrollTypes(data.data);
            } catch (error) {
                Toast({
                    message: "Error al obtener los tipos de nomina: " + error,
                    type: "error", position: "top-right"
                });
            } finally {
                setLoading(false);
            }
        }

        fetchPayrollTypes();
    }, []);

    const handleAdd = () => {
        setSelectedPayrollType(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const payrollTypeToEdit = payrollTypes.find((payrollType) => payrollType.id === id);
        setSelectedPayrollType(payrollTypeToEdit);
        setIsModalOpen(true);
    }

    const handleDelete = (id: number) => {
        Toast({
            message: "¿Estás seguro de eliminar este tipo de nomina?",
            type: "question",
            position: "top-right",
            handleDelete: async (value: boolean) => {
                toast.dismiss();
                if (!value) {
                    return
                }
                try {
                    await deletePayrollType(id);
                    setPayrollTypes((prev) => prev.filter((payrollType) => payrollType.id !== id));
                    Toast({
                        message: "Tipo de nomina eliminado correctamente",
                        type: "success",
                        position: "top-right"
                    });
                } catch (error) {
                    Toast({
                        message: "Error al eliminar el tipo de nomina: " + error,
                        type: "error",
                        position: "top-right"
                    });
                }
            }
        });
    };

    const handleSave = async (data: any) => {
        const { id } = data;
        try {
            setCreateUpdateLoading(true);
            if (id !== null ) await handleUpdate(data);
            if (id === null) await handleCreate(data);
        } catch (error) {
            Toast({
                message: "Error al guardar el tipo de nomina: " + error,
                type: "error",
                position: "top-right"
            })
        }finally {
            setCreateUpdateLoading(false);
        }
    }

    const handleUpdate = async (data: any) => {
        const response = await updatePayrollType(data.id, data);
        setPayrollTypes((prev) =>
            prev.map((payrollType) => 
                payrollType.id === data.id ? response.data : payrollType
            )
        );
        Toast({
            message: "Tipo de nomina actualizado correctamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCreate = async (data: any) => {
        const response = await createPayrollType(data);
        setPayrollTypes((prev) => [...prev, response.data]);
        Toast({
            message: "Tipo de nomina creado correctamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPayrollType(null);
    };

    return (
        <>
            <Table
                loading={loading}
                data={payrollTypes}
                title="Tipos de nomina"
                description="Lista de tipos de nomina disponibles en el sistema"
                columns={columns}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <PayrollTypeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                payrollType={selectedPayrollType}
            />
            {createUpdateLoading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>
    );
}