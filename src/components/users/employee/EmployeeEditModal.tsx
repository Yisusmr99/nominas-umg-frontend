import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from 'dayjs';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface EmployeeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    employee?: any;
    contractTypes?: any[];
}

interface FormDataType {
    dpi: string;
    nit: string;
    position: string;
    salary: string;
    termination_date: Dayjs | null;
    is_active: number;
    contract_type_id: string;
    hire_date: Dayjs | null;
}

const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
    isOpen, onClose, onSave, employee, contractTypes = []
}) => {
    const initialFormState: FormDataType = {
        dpi: "",
        nit: "",
        position: "",
        salary: "",
        termination_date: null,
        is_active: 1,
        contract_type_id: "",
        hire_date: null,
    };

    const [formData, setFormData] = useState<FormDataType>(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (employee) {
            const terminationDate = employee.termination_date ? dayjs(employee.termination_date) : null;
            const hireDate = employee.hire_date ? dayjs(employee.hire_date) : null;
            setFormData({
                ...employee,
                termination_date: terminationDate,
                hire_date: hireDate,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [employee]);

    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'dpi':
                return !value ? 'El DPI es requerido' : '';
            case 'nit':
                return !value ? 'El NIT es requerido' : '';
            case 'salary':
                return !value ? 'El salario es requerido' : 
                    parseFloat(value) <= 0 ? 'El salario debe ser mayor a 0' : '';
            case 'contract_type_id':
                return !value ? 'El tipo de contrato es requerido' : '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSelectChange = (field: string) => (event: any) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, value)
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const fields = ['dpi', 'nit', 'salary', 'contract_type_id'];

        fields.forEach(field => {
            const error = validateField(field, formData[field as keyof FormDataType]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                id: employee?.id || null,
                termination_date: formData.termination_date ? formData.termination_date.format('YYYY-MM-DD') : null,
            };
            onSave(submitData);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <form onSubmit={handleSubmit}>
                <DialogTitle>Editar Empleado</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
                        <TextField
                            label="DPI"
                            name="dpi"
                            value={formData.dpi}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.dpi}
                            helperText={errors.dpi}
                        />
                        <TextField
                            label="NIT"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.nit}
                            helperText={errors.nit}
                        />
                        <FormControl fullWidth error={!!errors.contract_type_id}>
                            <InputLabel>Tipo de Contrato</InputLabel>
                            <Select
                                value={formData.contract_type_id}
                                label="Tipo de Contrato"
                                onChange={handleSelectChange('contract_type_id')}
                            >
                                {contractTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.contract_type_id && <p style={{ color: 'red', fontSize: '0.75rem' }}>{errors.contract_type_id}</p>}
                        </FormControl>
                        <TextField
                            label="Puesto"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Salario"
                            name="salary"
                            type="number"
                            value={formData.salary}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.salary}
                            helperText={errors.salary}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Contratación"
                                value={formData.hire_date}
                                readOnly
                                disabled
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Estado"
                            value={formData.is_active === 1 ? "Activo" : "Inactivo"}
                            disabled
                            fullWidth
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Finalización"
                                value={formData.termination_date}
                                readOnly
                                disabled
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" color="success" variant="outlined">
                        Actualizar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default EmployeeEditModal;