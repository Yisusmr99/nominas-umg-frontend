'use client';
import React, { useState, useEffect } from "react";
import Table from "@/components/ui/table";
import { Backdrop, CircularProgress } from "@mui/material";
import Toast from "@/components/ui/Toast";
import { toast } from "react-toastify";
import { 
    getContractTypes, createContractType,
    updateContractType, deleteContractType 
} from "@/services/contract-type";
import ContractTypeModal from "@/components/contract-types/ContracTypeModal";

const columns = [
    { name: "Nombre del tipo de contrato", nameFile: "name", },
];

export default function BonusPage() {

    const [contractTypes, setContractTypes] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    const [selectedContractType, setSelectedContractType] = useState<any>(null);

    useEffect(() => {
        const fetchContractTypes = async () => {
            try {
                const data = await getContractTypes();
                setContractTypes(data.data);
            } catch (error) {
                Toast({ 
                    message: "Error al obtener los tipos de contrato: " + error, 
                    type: "error", position: "top-right" 
                });
            } finally {
                setLoading(false);
            }
        }

        fetchContractTypes();
    }, []);

    const handleAdd = () => {
        setSelectedContractType(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const contractTypeToEdit = contractTypes.find((contractType) => contractType.id === id);
        setSelectedContractType(contractTypeToEdit);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        Toast({
            message: "¿Estás seguro de eliminar este tipo de contrato?",
            type: "question",
            position: "top-right",
            handleDelete: async (value: boolean) => {
                toast.dismiss();
                if (!value) {
                    return;
                }
                
                try {
                    await deleteContractType(id);
                    setContractTypes((prevContractTypes) =>
                        prevContractTypes.filter((contractType) => contractType.id !== id)
                    );
                    Toast({
                        message: "Tipo de contrato eliminado exitosamente",
                        type: "success",
                        position: "top-right"
                    });
                } catch (error) {
                    Toast({ 
                        message: "Error al eliminar el tipo de contrato: " + error, 
                        type: "error", position: "top-right" 
                    });
                }   
            }
        });
    };

    const handleSave = async (data: any) => {
        const { id } = data;
        try {
            setCreateUpdateLoading(true);
            if (id !== null) await handleUpdate(data);
            if (id === null) await handleCreate(data);
        } catch (error: any) {
            Toast({ 
                message: "Error al guardar el tipo de contrato: " + error.message,
                type: "error", position: "top-right" 
            });
        }finally{
            setCreateUpdateLoading(false);
        }
    };

    const handleUpdate = async (data: any) => {
        const response = await updateContractType(data.id, data);
        setContractTypes((prevContractTypes) =>
            prevContractTypes.map((contractType) =>
                contractType.id === data.id ? response.data : contractType
            )
        );
        Toast({
            message: "Bono actualizado exitosamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCreate = async (data: any) => {
        const response = await createContractType(data);
        setContractTypes((prevContractTypes) => [...prevContractTypes, response.data]);
        Toast({
            message: "Bono creado exitosamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContractType(null);
    };

    return (
        <>
            <Table
                loading={loading}
                data={contractTypes}
                title="Bonos"
                description="Lista de bonos disponibles en el sistema."
                columns={columns}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <ContractTypeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}  
                onSave={handleSave}
                contractType={selectedContractType}
            />
            {createUpdateLoading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>
    );
}