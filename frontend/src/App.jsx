import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Connection from "./components/Connection";
import Broadcast from "./components/Broadcast";
import Unauthorized from "./pages/Unauthorized";
import {Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { setupInterceptors } from "./api";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
function App() {
    const{refreshAccessToken} = useAuth();

    useEffect(() =>{
      setupInterceptors(refreshAccessToken);
    },[]);
  return (
    <>
      <Routes>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/" element={
          <ProtectedRoute>
              <Home/>
          </ProtectedRoute>
          }/>
          <Route path = "/connection" element={<Connection/>}/>
        <Route path = "/broadcast" element={<Broadcast/>}/>
        <Route path = "/unauthorized" element={<Unauthorized/>}/>
        
      </Routes>
    </>
  )
}

export default App;
