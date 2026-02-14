import { useState } from "react";
import api from "../api";
import { useRequest } from "../contexts/RequestContext";
import { useAuth } from "../contexts/AuthContext";
function Parcel({setCreate}){
    const [description,setDescription] = useState("");
    const [email,setEmail] = useState("");
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState("");
    const demoLocation = [27.7172,85.3240];
    const {requestData,setRequest} = useRequest();
    const {token,user} = useAuth();
   async function handleSubmit(e){
        e.preventDefault();
        if(!user){
            alert("user not loaded yet");
            return;
        }
        console.log("current user", user);
        setLoading(true);
        setError("");

        try{
            const response = await api.post("/api/parcel/request",{
                parcel_description: description,
                receiver_email: email,
                sender_location: demoLocation
                
            });
            console.log("request response", response);
            const request_data = response.data;
            setRequest(request_data);

                    const ws = new WebSocket(
                    `ws://localhost:8000/api/parcel/send_notification/${user.id}?token=${token}`
            );

            ws.onopen = () => {
                console.log("WebSocket connected. Sending parcel notification...");

                //Send notification message
                
                console.log("Request data",request_data);
                ws.send(
                JSON.stringify({
                    request_id: request_data.id,
                    receiver_id : request_data.receiver_id,
                    sender_name: user.name,
                })
                );
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Message from server:", data);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
            };

            ws.onclose = () => {
                console.log("WebSocket closed after sending notification");
            };

            alert("Parcel request sent successfully!");
            setCreate(false); 
        }catch(err){
            console.log(err);
            setError(err.response?.data?.message || "Failed to send parcel");
        }finally{
            setLoading(false);
        }
    }
    return(
        <>
            <input type="text"
            value={description}
            onChange={(e)=> setDescription(e.target.value)} 
            required
            placeholder="description"/><br/>
            <input type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)} 
            required
            placeholder="receiver email"/><br/>
            <button type="submit" disabled={loading}
            onClick={handleSubmit}
            >{loading? "Sending..." : "Create"}</button>
            <button type="button" onClick={(e) => setCreate(false)}>Cancel</button>
        </>
    );
}
export default Parcel;