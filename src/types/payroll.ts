export interface User {
    id: number;
    username: string;
    name: string;
    last_name: string;
    email: string;
    role_id: number;
    is_active: number;
}

export interface ContractType {
    id: number;
    name: string;
}

export interface Employee {
    id: number;
    user_id: number;
    dpi: number;
    nit: number;
    position: string;
    salary: number;
    hire_date: string;
    contract_type_id: number;
    user: User;
    contract_type: ContractType;
}

export interface PayrollType {
    id: number;
    name: string;
}

export interface Bonus {
    id: number;
    bonu_name: string;
    bonu_percentage: number;
    bonu_fixed_amount: number;
}

export interface PayrollBonus {
    id: number;
    payroll_id: number;
    bonus_id: number;
    amount: number;
    bonus: Bonus;
}

export interface Deduction {
    id: number;
    deduction_name: string;
    deduction_percentage: number;
    deduction_fixed_amount: number | null;
}

export interface PayrollDeduction {
    id: number;
    payroll_id: number;
    deduction_id: number;
    amount: number;
    deduction: Deduction;
}

export interface Payroll {
    id: number;
    employee_id: number;
    payroll_type_id: number;
    period_start: string;
    period_end: string;
    total_income: number;
    total_deductions: number;
    net_salary: number;
    status: string;
    payment_date: string | null;
    approved_by: number | null;
    employee: Employee;
    payroll_type: PayrollType;
    payroll_bonu: PayrollBonus[];
    payroll_deduction: PayrollDeduction[];
}