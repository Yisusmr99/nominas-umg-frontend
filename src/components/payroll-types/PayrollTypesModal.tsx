import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from "@mui/material";

interface PayrollTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    payrollType?: any;
}

const PayrollTypeModal: React.FC<PayrollTypeModalProps> = ({ isOpen, onClose, onSave, payrollType }) => {

    const initialFormState = {
        name: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if (payrollType) {
            setFormData({
                name: payrollType.name || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }
    , [payrollType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleClose = () => {
        setFormData(initialFormState);
        onClose();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: payrollType?.id || null // Include the id if we're editing
        });
        handleClose();
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{payrollType ? "Editar tipo de nomina" : "Agregar tipo de nomina"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2}} >
                        <TextField
                            name="name"
                            label="Nombre del tipo de nomina"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" color="success" variant="outlined" onClick={handleSubmit}>
                        {payrollType ? "Actualizar" : "Agregar"}
                    </Button>
                </DialogActions>
            </ form>
        </Dialog>
    );

}

export default PayrollTypeModal;