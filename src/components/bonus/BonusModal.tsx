import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  bonus?: any;
}

const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose, onSave, bonus }) => {
  const initialFormState = {
    bonu_name: '',
    bonu_percentage: '',
    bonu_fixed_amount: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (bonus) {
      setFormData({
        bonu_name: bonus.bonu_name || '',
        bonu_percentage: bonus.bonu_percentage || '',
        bonu_fixed_amount: bonus.bonu_fixed_amount || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [bonus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: bonus?.id || null // Include the id if we're editing
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{bonus ? 'Editar Bono' : 'Agregar Bono'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="bonu_name"
              label="Nombre"
              value={formData.bonu_name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="bonu_percentage"
              label="Porcentaje de bonificación"
              value={formData.bonu_percentage}
              onChange={handleChange}
              type="number"
              fullWidth
            />
            <TextField
              name="bonu_fixed_amount"
              label="Monto fijo"
              value={formData.bonu_fixed_amount}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error">Cancelar</Button>
          <Button type="submit" variant="outlined" color="success">
            {bonus ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BonusModal;