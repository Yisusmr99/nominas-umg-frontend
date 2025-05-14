export interface user {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role_id: number;
    is_active: number;
}

export interface Employee {
    id: number;
    user_id: number;
    dpi: number;
    nit: number;
    position: string;
    salary: number;
    hire_date: string;
    termination_date: string | null;
    is_active: number;
    contract_type_id: number;
    user: user;
}

export interface PerformanceEvaluation {
    id: number;
    employee_id: number;
    quality_of_work: number;
    achievement_of_objectives: number;
    responsibility: number;
    teamwork_communication: number;
    proactivity: number;
    final_note: number;
    start_period: string;
    end_period: string;
    created_at: string;
    updated_at: string;
    employee: Employee;
}
