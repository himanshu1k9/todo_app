
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => 
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_PATH}/todo/verifytoken`, {withCredentials: true})
        .then(res => {
          setUser(res.data.user);
          setIsAuthenticated(res.data.isAuthenticated);
        }).catch(err => { 
        setIsAuthenticated(false);
        setUser({});
        }).finally(() => setLoading(false));
    },[]);
    
    return ( 
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading }}>
            { children }
        </AuthContext.Provider>
    );
}

export default AuthContext;