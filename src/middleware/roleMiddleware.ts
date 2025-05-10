import { User } from "@/types/auth";

const ADMIN_ROLE_ID = 1;
const EMPLOYEE_ROLE_ID = 2;

export const routeAccessMap = {
    '/dashboard': [ADMIN_ROLE_ID, EMPLOYEE_ROLE_ID],
    '/payrolls': [ADMIN_ROLE_ID],
    '/users': [ADMIN_ROLE_ID],
    '/deductions': [ADMIN_ROLE_ID],
    '/bonus': [ADMIN_ROLE_ID],
    '/contract-types': [ADMIN_ROLE_ID],
    '/payroll-types': [ADMIN_ROLE_ID],
    '/payments': [EMPLOYEE_ROLE_ID]
};

export const hasAccess = (path: string): boolean => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;

        const user: User = JSON.parse(userStr);
        const allowedRoles = routeAccessMap[path as keyof typeof routeAccessMap];
        
        return allowedRoles?.includes(user.role_id) ?? false;
    } catch (error) {
        console.error('Error checking role access:', error);
        return false;
    }
};
