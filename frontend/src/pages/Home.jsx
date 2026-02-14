import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Parcel from "../components/Parcel";
function Home(){
    const {logout} = useAuth(); 
    const [create,setCreate] = useState(false);
    const handleClick = (e) =>{
        e.preventDefault();
        setCreate(true);
    }
    return(
        <>
            This is home page
            <button onClick={handleClick}>Create Parcel</button><br/>
            {create ? <Parcel setCreate = {setCreate}/> : "" }
            <br/><button type="button" onClick={logout}>logout</button>
        </>
    );
}
export default Home;