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

interface ContractTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    contractType?: any;
}

const ContractTypeModal: React.FC<ContractTypeModalProps> = ({ isOpen, onClose, onSave, contractType }) => {

    const initialFormState = {
        name: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    useEffect(() => {
        if (contractType) {
            setFormData({
                name: contractType.name || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }
    , [contractType]);
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
            id: contractType?.id || null // Include the id if we're editing
        });
        handleClose();
    }
    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{contractType ? "Editar tipo de contrato" : "Agregar tipo de contrato"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2}} >
                        <TextField
                            name="name"
                            label="Nombre del tipo de contrato"
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
                        {contractType ? "Actualizar" : "Agregar"}
                    </Button>
                </DialogActions>
            </ form>
        </Dialog>
    );

}

export default ContractTypeModal;