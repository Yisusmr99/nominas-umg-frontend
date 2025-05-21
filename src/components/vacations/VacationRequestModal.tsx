import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface VacationRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    availableDays: number;
}

export default function VacationRequestModal({ isOpen, onClose, onSave, availableDays }: VacationRequestModalProps) {
    const [totalDays, setTotalDays] = useState<number>(1);
    const [error, setError] = useState<string>("");

    const handleTotalDaysChange = (value: number) => {
        setTotalDays(value);
        if (value > availableDays) {
            setError(`No puedes solicitar más de ${availableDays} días`);
        } else if (value < 1) {
            setError("Debes solicitar al menos 1 día");
        } else {
            setError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!error && totalDays <= availableDays) {
            onSave({
                total_days: totalDays,
                status: 1
            });
            onClose();
            setTotalDays(1);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ paddingBottom: "0.5rem" }}>Nueva Solicitud de Vacaciones</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ paddingTop: "0.5rem" }}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">Días disponibles: {availableDays}</p>
                    </div>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Días solicitados"
                        type="number"
                        fullWidth
                        value={totalDays}
                        onChange={(e) => handleTotalDaysChange(Number(e.target.value))}
                        inputProps={{ min: 1, max: availableDays }}
                        error={!!error}
                        helperText={error}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={!!error || totalDays > availableDays}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
