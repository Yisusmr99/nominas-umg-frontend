'use client';

import React, { useState, useEffect } from "react";
import { getBonuses, createBonus, updateBonus, deleteBonus } from "@/services/bonus";
import Table from "@/components/ui/table";
import BonusModal from "@/components/bonus/BonusModal";
import { Backdrop, CircularProgress } from "@mui/material";
import Toast from "@/components/ui/Toast";
import { toast } from "react-toastify";

const columns = [
    { name: "Nombre", nameFile: "bonu_name", },
    { name: "Porcentaje de bonificacion", nameFile: "bonu_percentage", },
    { name: "Monto fijo", nameFile: "bonu_fixed_amount", },
];

export default function BonusPage() {

    const [bonuses, setBonuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
    const [selectedBonus, setSelectedBonus] = useState<any>(null);

    useEffect(() => {
        const fetchBonuses = async () => {
            try {
                const data = await getBonuses();
                setBonuses(data.data);
            } catch (error) {
                Toast({ 
                    message: "Error al obtener los bonos: " + error, 
                    type: "error", position: "top-right" 
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBonuses();
    }, []);

    const handleAdd = () => {
        setSelectedBonus(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const bonusToEdit = bonuses.find((bonus) => bonus.id === id);
        setSelectedBonus(bonusToEdit);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        Toast({
            message: "¿Estás seguro de eliminar este bono?",
            type: "question",
            position: "top-right",
            handleDelete: async (value: boolean) => {
                toast.dismiss();
                if (!value){ 
                    return;
                }

                try {
                    setCreateUpdateLoading(true);
                    await deleteBonus(id);
                    setBonuses((prevBonuses) => prevBonuses.filter((bonus) => bonus.id !== id));
                    Toast({
                        message: "Bono eliminado exitosamente",
                        type: "success",
                        position: "top-right"
                    });
                } catch (error: any) {
                    Toast({ 
                        message: "Error al eliminar el bono: " + error.message, 
                        type: "error", position: "top-right" 
                    });
                } finally {
                    setCreateUpdateLoading(false);
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
                message: "Error al guardar el bono: " + error.message,
                type: "error", position: "top-right" 
            });
        }finally{
            setCreateUpdateLoading(false);
        }
    };

    const handleUpdate = async (data: any) => {
        const response = await updateBonus(data.id, data);
        setBonuses((prevBonuses) =>
            prevBonuses.map((bonus) => (bonus.id === data.id ? response.data : bonus))
        );
        Toast({
            message: "Bono actualizado exitosamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCreate = async (data: any) => {
        const response = await createBonus(data);
        setBonuses((prevBonuses) => [...prevBonuses, response.data]);
        Toast({
            message: "Bono creado exitosamente",
            type: "success",
            position: "top-right"
        });
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBonus(null);
    };

    return (
        <>
            <Table
                loading={loading}
                data={bonuses}
                title="Bonos"
                description="Lista de bonos disponibles en el sistema."
                columns={columns}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <BonusModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                bonus={selectedBonus}
            />
            {createUpdateLoading && (
                <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>
    );
}