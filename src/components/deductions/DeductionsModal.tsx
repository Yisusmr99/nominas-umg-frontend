import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box
} from "@mui/material";


interface DeductionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    deduction?: any;
}

const DeductionsModal: React.FC<DeductionsModalProps> = ({
    isOpen,onClose, onSave, deduction
}) => {
    const initialFormState = {
        deduction_name: "",
        deduction_percentage: "",
        deduction_fixed_amount: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (deduction) {
            setFormData({
                deduction_name: deduction.deduction_name || "",
                deduction_percentage: deduction.deduction_percentage || "",
                deduction_fixed_amount: deduction.deduction_fixed_amount || "",
            });
        } else {
            setFormData(initialFormState);
        }
    }, [deduction]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleClose = () => {
        setFormData(initialFormState);
        onClose();
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: deduction?.id || null, // Include the id if we're editing
        });
        handleClose();
    };
    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{deduction ? "Editar Deducción" : "Agregar Deducción"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt:2 }}>
                        <TextField
                            label="Nombre de la Deducción"
                            name="deduction_name"
                            value={formData.deduction_name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Porcentaje de Deducción"
                            name="deduction_percentage"
                            value={formData.deduction_percentage}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Monto Fijo"
                            name="deduction_fixed_amount"
                            value={formData.deduction_fixed_amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 2}}>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="success" variant="outlined">
                        {deduction ? "Actualizar" : "Agregar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
export default DeductionsModal;
