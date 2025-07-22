import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUser = useCallback(async () => {
    try {
        setIsLoading(true);
        const token = await getToken();
        const { data } = await axios.get('/api/User', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.success) {
            setIsOwner(data.role === "hotelOwner");
            setSearchedCities(data.recentSearchedCities || []);
        } else {
            setTimeout(() => {
                fetchUser();
            }, 5000);
        }
    } catch (error) {
        // console.error('Full error:', error);
        // console.error('Error response:', error.response);
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user data";
        toast.error(errorMessage);
    } finally {
        setIsLoading(false);
    }
}, [getToken]);

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        isLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};