import { useAuth } from "../contexts/AuthContext";
function Home(){
    const {logout} = useAuth(); 
    return(
        <>
            This is home page
            <button type="button" onClick={logout}>logout</button>
        </>
    );
}
export default Home;