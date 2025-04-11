'use client';

import React, { useState, useEffect } from "react";

import Table from "@/components/ui/table";
import { getDeductions } from "@/services/deduction";

const columns = [
    { name: "Nombre", nameFile: "deduction_name", },
    { name: "Porcentaje de la deducción", nameFile: "deduction_percentage", },
    { name: "Monto fijo", nameFile: "deduction_fixed_amount", },
];

export default function DeductionPage() {

    const [deductions, setDeductions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBonuses = async () => {
            try {
                const data = await getDeductions();
                setDeductions(data.data);
            } catch (error) {
                console.error("Error fetching bonuses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBonuses();
    }, []);

    return (
        <Table
            loading={loading}
            data={deductions}
            title="Deducciones"
            description="Lista de deducciones disponibles en el sistema."
            columns={columns}
        />
    );
}