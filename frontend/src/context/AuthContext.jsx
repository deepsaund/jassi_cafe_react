import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE}/settings`);
            const data = await res.json();
            setSettings(data);
        } catch (err) {
            console.error("Settings fetch error:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== "undefined") {
                    setUser(JSON.parse(storedUser));
                }
                await fetchSettings();
            } catch (e) {
                console.error("Auth init error:", e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const login = async (phone, password) => {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshUser = (newData) => {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, settings, refreshSettings: fetchSettings, login, logout, refreshUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
