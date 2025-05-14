import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Grid
} from '@mui/material';
import { getEmployees } from '@/services/employees';

interface PerformanceEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ratingOptions = [
  { value: 0, label: '0 - Insuficiente' },
  { value: 1, label: '1 - Regular' },
  { value: 2, label: '2 - Aceptable' },
  { value: 3, label: '3 - Bueno' },
  { value: 4, label: '4 - Muy Bueno' },
  { value: 5, label: '5 - Excelente' },
];

const PerformanceEvaluationModal: React.FC<PerformanceEvaluationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: '',
    quality_of_work: '',
    achievement_of_objectives: '',
    responsibility: '',
    teamwork_communication: '',
    proactivity: '',
    start_period: '',
    end_period: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees({});
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      employee_id: '',
      quality_of_work: '',
      achievement_of_objectives: '',
      responsibility: '',
      teamwork_communication: '',
      proactivity: '',
      start_period: '',
      end_period: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nueva Evaluación de Desempeño</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={6}>
                <TextField
                  select
                  name="employee_id"
                  label="Empleado"
                  value={formData.employee_id}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id.toString()}>
                      {employee.user.name} {employee.user.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  name="quality_of_work"
                  label="Calidad de Trabajo"
                  value={formData.quality_of_work}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {ratingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  name="achievement_of_objectives"
                  label="Logro de Objetivos"
                  value={formData.achievement_of_objectives}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {ratingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  name="responsibility"
                  label="Responsabilidad"
                  value={formData.responsibility}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {ratingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  name="teamwork_communication"
                  label="Trabajo en Equipo y Comunicación"
                  value={formData.teamwork_communication}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {ratingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  name="proactivity"
                  label="Proactividad"
                  value={formData.proactivity}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {ratingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  name="start_period"
                  label="Fecha Inicio"
                  type="date"
                  value={formData.start_period}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  name="end_period"
                  label="Fecha Fin"
                  type="date"
                  value={formData.end_period}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="success" disabled={isLoading}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PerformanceEvaluationModal;
