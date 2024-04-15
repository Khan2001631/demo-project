import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

export const Referral = () => {
    const params = useParams();
    useEffect(() => {
        if (params?.id) {
            localStorage.setItem('refKey', params?.id);
        }
    }, [params?.id]);
    
    return <Navigate to="/login" />;
};