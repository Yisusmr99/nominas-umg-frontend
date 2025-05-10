import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';
import { getBonuses } from '@/services/bonus';
import { getDeductions } from '@/services/deduction';
import { getContractTypes } from '@/services/contract-type';
import { getPayrollTypes } from '@/services/payroll-type';
import { addDays, format, getDaysInMonth } from 'date-fns';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  payroll?: any;
}

const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, onSave, payroll }) => {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [deductions, setDeductions] = useState<any[]>([]);
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  const [payrollTypes, setPayrollTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialFormState = {
    contract_type_id: '',
    period_start: '',
    period_end: '',
    payroll_type_id: '',
    deductions: ['1', '2'] as string[], // Default deductions
    bonus: ['1'] as string[] // Default bonus
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bonusesData, deductionsData, contractTypesData, payrollTypesData] = await Promise.all([
          getBonuses(),
          getDeductions(),
          getContractTypes(),
          getPayrollTypes()
        ]);
        setBonuses(bonusesData.data);
        setDeductions(deductionsData.data);
        setContractTypes(contractTypesData.data);
        setPayrollTypes(payrollTypesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (payroll) {
      setFormData({
        ...payroll
      });
    } else {
      setFormData(initialFormState);
    }
  }, [payroll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContractTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const contractTypeId = e.target.value;
    setFormData(prev => ({
      ...prev,
      contract_type_id: contractTypeId,
      period_start: '',
      period_end: ''
    }));
  };

  const calculateEndDate = (startDate: string, contractTypeId: string) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let end: Date;

    switch (contractTypeId) {
      case '1': // Semanal
        end = addDays(start, 6); // 7 días
        break;
      case '2': // Quincenal
        end = addDays(start, 15); // 15 días
        break;
      case '3': // Mensual
        const daysInMonth = getDaysInMonth(start);
        end = addDays(start, daysInMonth); // Días del mes menos 1
        break;
      default:
        return '';
    }

    return format(end, 'yyyy-MM-dd');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;

    if (formData.payroll_type_id === '1') {
      const endDate = calculateEndDate(startDate, formData.contract_type_id);
      setFormData(prev => ({
        ...prev,
        period_start: startDate,
        period_end: endDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        period_start: startDate
      }));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      period_end: e.target.value
    }));
  };

  const handleCheckboxChange = (type: 'bonus' | 'deductions', id: string) => {
    setFormData(prev => {
      const currentArray = [...prev[type]];
      const index = currentArray.indexOf(id);
      
      if (index === -1) {
        currentArray.push(id);
      } else {
        currentArray.splice(index, 1);
      }

      return {
        ...prev,
        [type]: currentArray
      };
    });
  };

  const isDefaultItem = (type: 'bonus' | 'deductions', id: string) => {
    if (type === 'bonus') return id === '1';
    if (type === 'deductions') return id === '1' || id === '2';
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialFormState);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{payroll ? 'Editar Nómina' : 'Crear Nómina'}</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                select
                name="payroll_type_id"
                label="Tipo de Nómina"
                value={formData.payroll_type_id}
                onChange={handleChange}
                fullWidth
              >
                {payrollTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="contract_type_id"
                label="Tipo de Contrato"
                value={formData.contract_type_id}
                onChange={handleContractTypeChange}
                fullWidth
              >
                {contractTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="period_start"
                label="Fecha Inicio"
                type="date"
                value={formData.period_start}
                onChange={handleStartDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={!formData.contract_type_id}
                helperText={
                  formData.contract_type_id === '1' && formData.payroll_type_id === '1' ? 'El período será de 7 días' :
                  formData.contract_type_id === '2' && formData.payroll_type_id === '1' ? 'El período será de 15 días' :
                  formData.contract_type_id === '3' && formData.payroll_type_id === '1' ? 'El período será de 30 días' : ''
                }
              />

              <TextField
                name="period_end"
                label="Fecha Fin"
                type="date"
                value={formData.period_end}
                onChange={handleEndDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={formData.payroll_type_id === '1'}
              />

              {formData.payroll_type_id === '1' && (
                <>
                  <Box>
                    <h3>Bonificaciones</h3>
                    <Grid container spacing={1} >
                      {bonuses.map((bonus) => (
                        <Grid size={4} key={bonus.id}>
                          <FormControlLabel
                            sx={{
                              display: 'flex',
                              margin: 0,
                              '& .MuiFormControlLabel-label': {
                                fontSize: '0.95rem' // Equivalent to 14px
                              }
                            }}
                            control={
                              <Checkbox
                                checked={formData.bonus.includes(bonus.id.toString())}
                                onChange={() => handleCheckboxChange('bonus', bonus.id.toString())}
                                disabled={isDefaultItem('bonus', bonus.id.toString())}
                              />
                            }
                            label={bonus.bonu_name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box>
                    <h3>Deducciones</h3>
                    <Grid container spacing={1} >
                      {deductions.map((deduction) => (
                        <Grid size={4} key={deduction.id}>
                          <FormControlLabel
                            sx={{
                              display: 'flex',
                              margin: 0,
                              '& .MuiFormControlLabel-label': {
                                fontSize: '0.95rem' // Equivalent to 14px
                              }
                            }}
                            control={
                              <Checkbox
                                checked={formData.deductions.includes(deduction.id.toString())}
                                onChange={() => handleCheckboxChange('deductions', deduction.id.toString())}
                                disabled={isDefaultItem('deductions', deduction.id.toString())}
                              />
                            }
                            label={deduction.deduction_name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="success" disabled={isLoading}>
            {payroll ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PayrollModal;