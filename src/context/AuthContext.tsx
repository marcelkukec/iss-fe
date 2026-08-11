import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import {useNavigate} from "react-router-dom";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    avatar: string | null;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api.get("/users/me").then((res) => {
                    setUser(res.data);
                    setIsLoggedIn(true);
                }).catch(() => {
                    logout();
                }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token: string) => {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
            await refreshUser();
            setIsLoggedIn(true);
        } catch {
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsLoggedIn(false);
        setUser(null);

        setTimeout(() => {
            navigate("/login");
        }, 0);
    };

    const refreshUser = async () => {
        const res = await api.get('users/me');
        setUser(res.data);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
