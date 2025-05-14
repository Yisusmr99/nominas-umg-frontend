import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from 'dayjs';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface UsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    user?: any;
    roles?: any[];
    contractTypes?: any[];
}

interface FormDataType {
    username: string;
    name: string;
    last_name: string;
    email: string;
    role_id: string;
    dpi: string;
    nit: string;
    position: string;
    salary: string;
    hire_date: Dayjs | null;
    contract_type_id: string;
}

const UsersModal: React.FC<UsersModalProps> = ({
    isOpen, onClose, onSave, user, roles = [], contractTypes = []
}) => {
    const initialFormState: FormDataType = {
        username: "",
        name: "",
        last_name: "",
        email: "",
        role_id: "",
        dpi: "",
        nit: "",
        position: "",
        salary: "",
        hire_date: null,
        contract_type_id: "",
    };

    const [formData, setFormData] = useState<FormDataType>(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            const hireDate = user.hire_date ? dayjs(user.hire_date) : null;
            setFormData({
                ...user,
                hire_date: hireDate,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [user]);

    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'username':
                return !value ? 'El username es requerido' : value.length < 3 ? 'Mínimo 3 caracteres' : '';
            case 'name':
                return !value ? 'El nombre es requerido' : '';
            case 'last_name':
                return !value ? 'El apellido es requerido' : '';
            case 'email':
                return !value ? 'El email es requerido' : 
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? 'Email inválido' : '';
            case 'role_id':
                return !value ? 'El rol es requerido' : '';
            case 'dpi':
                return !value ? 'El DPI es requerido' : '';
            case 'nit':
                return !value ? 'El NIT es requerido' : '';
            case 'salary':
                return !value ? 'El salario es requerido' : 
                    parseFloat(value) <= 0 ? 'El salario debe ser mayor a 0' : '';
            case 'hire_date':
                return !value ? 'La fecha de contratación es requerida' : '';
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

    const handleDateChange = (newDate: Dayjs | null) => {
        setFormData(prev => ({
            ...prev,
            hire_date: newDate
        }));
        setErrors(prev => ({
            ...prev,
            hire_date: validateField('hire_date', newDate)
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const fields = [
            'username', 'name', 'last_name', 'email', 'role_id',
            'dpi', 'nit', 'salary', 'hire_date', 'contract_type_id'
        ];

        fields.forEach(field => {
            const error = validateField(field, formData[field as keyof FormDataType]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setFormData(initialFormState);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                id: user?.id || null,
                hire_date: formData.hire_date ? formData.hire_date.format('YYYY-MM-DD') : null,
            };
            onSave(submitData);
            handleClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{user ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                        <TextField
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Apellido"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <FormControl fullWidth error={!!errors.role_id}>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={formData.role_id}
                                label="Rol"
                                onChange={handleSelectChange('role_id')}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.role_id && <p style={{ color: 'red', fontSize: '0.75rem' }}>{errors.role_id}</p>}
                        </FormControl>
                        <TextField
                            label="DPI"
                            name="dpi"
                            value={formData.dpi}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="NIT"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            fullWidth
                        />
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
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Contratación"
                                value={formData.hire_date}
                                onChange={handleDateChange}
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        sx: { minWidth: 200 },
                                        fullWidth: true,
                                        error: !!errors.hire_date,
                                        helperText: errors.hire_date
                                    }
                                }}
                            />
                        </LocalizationProvider>
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
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="success" variant="outlined">
                        {user ? "Actualizar" : "Agregar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default UsersModal;