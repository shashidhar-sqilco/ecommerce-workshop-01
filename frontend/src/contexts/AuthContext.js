import axios from 'axios';
const { createContext, useState, useEffect, useContext } = require("react");
const AuthContext=createContext(null);

axios.withCredentials=true;

export function useAuth(){
    return useContext(AuthContext);
}
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
const [loading,setLoading]=useState(true);

useEffect(()=>{
    checkAuthStatus();

},[]);
const checkAuthStatus=async()=>{
try {
        const response = await axios.get("/api/users/me");
        setUser(response.data);
} catch (error) {
    setUser(null);
}
finally{
    setLoading(false);
}
}

const login=async(email,password)=>{
    try {
        const response=await axios.post('/api/users/login',{email,password});
        setUser(response.data.userId);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}
const signup = async (fullname,email, password) => {
  try {
    const response = await axios.post("/api/users/signup", {fullname, email, password });
    setUser(response.data.userId);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
 const logout = async () => {
   try {
     await axios.post(
       "/api/users/logout",
       {},
       { withCredentials: true }
     );
     setUser(null);
   } catch (error) {
     console.error("Logout error:", error);
   }
 };

const value={
    user,
    login,
    signup,
    logout,
    checkAuthStatus
};

return (<AuthContext.Provider value={value}
>{!loading && children}</AuthContext.Provider>) 
}