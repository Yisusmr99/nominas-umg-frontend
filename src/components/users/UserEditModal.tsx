import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    user?: any;
    roles?: any[];
}

interface FormDataType {
    username: string;
    name: string;
    last_name: string;
    email: string;
    role_id: string;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    user,
    roles = []
}) => {
    const initialFormState: FormDataType = {
        username: "",
        name: "",
        last_name: "",
        email: "",
        role_id: "",
    };

    const [formData, setFormData] = useState<FormDataType>(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                name: user.name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                role_id: user.role_id || "",
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

    const handleSelectChange = (event: any) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            role_id: value,
        }));
        setErrors(prev => ({
            ...prev,
            role_id: validateField('role_id', value)
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach(field => {
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
                id: user?.id || null,
            };
            onSave(submitData);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
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
                                onChange={handleSelectChange}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.role_id && <p style={{ color: 'red', fontSize: '0.75rem' }}>{errors.role_id}</p>}
                        </FormControl>
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
};

export default UserEditModal;