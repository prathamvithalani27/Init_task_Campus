import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/admin/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setIsAuthorized(true);
                } else {
                    localStorage.removeItem('adminToken');
                    setIsAuthorized(false);
                }
            } catch (err) {
                setIsAuthorized(false);
            }
        };
        verifyToken();
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;