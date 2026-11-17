import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeProfileService } from '@/services/employeeProtalServices/employee.profile.service';

export const useEmployeeProfile = () => {
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = useCallback(async () => {
        try {
            const data = await employeeProfileService.getProfile();
            setEmployee(data);
            // Also keep localStorage in sync
            if (typeof window !== 'undefined' && data) {
                const currentRaw = localStorage.getItem('user');
                const currentUser = currentRaw ? JSON.parse(currentRaw) : {};
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const isFaceRegistered = Boolean(
        Array.isArray(employee?.faceDescriptors) &&
        employee.faceDescriptors.length > 0 &&
        employee.faceDescriptors[0]?.length > 0
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const displayValue = (val: any) => {
        if (val === null || val === undefined || val === "") return "-";
        return val;
    };

    return {
        employee,
        setEmployee,
        loading,
        isFaceRegistered,
        fetchProfile,
        formatDate,
        displayValue
    };
};