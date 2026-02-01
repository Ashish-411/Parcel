import { useState,useEffect,useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
function Connection(){
    const {token} = useAuth();
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        if(!token){
            console.log("No token available");
            return;
        }
        if(wsRef.current){
            return;
        }
        const decoded = jwtDecode(token);
        const id = decoded.id;
        //const tempToken = "jkdjfkdjfdkjfdkjdfkdfkd";

        //web socket url adjust
        const wsUrl = `ws://localhost:8000/ws/${id}?token=${token}`;
    
        const ws = new WebSocket(wsUrl);
    
        wsRef.current = ws;
    
        //connection opened
    
        ws.onopen = () =>{
            console.log("web socket connected");
            setIsConnected(true);
    
            ws.send(JSON.stringify({room: 'track', message: "THis is message from frontend"}));
        };
    
        //listen message
    
        ws.onmessage = (event) =>{
            console.log("Message Received", event.data);
            setMessages( prev => [...prev, event.data]);
        };
    
        ws.onclose = (event) => {
            console.log("connection closed");
          
            console.log("Close code:", event.code);
            console.log("Close reason:", event.reason);
            console.log("Was clean:", event.wasClean);
          
            setIsConnected(false);          
            if (event.code === 1008 || event.code === 1011 || event.code === 1006) {
                alert("You can not enter this room");
              console.error("Policy violation:", event.reason);
              alert(`WebSocket closed: ${event.reason}`);
            }
          };
    
        //on error
        ws.onerror = (error) =>{
            console.error("Websocker error:",error);
        }
    
        //cleanup on unmount
        return () =>{
            if(ws.readyState === WebSocket.OPEN){
                console.log("Cleaning up websocket");
                ws.close();
            }
        }
    },[token]);

    // Function to send messages
    const sendMessage = (message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    };


    return (
        <>
            <h2>WebSocket Connection</h2>
                <p>Status: {isConnected ? "Connected ✓" : "Disconnected ✗"}</p>
                
                {/* Example usage */}
                <button onClick={() => sendMessage({ room: 'track', message: 'This is from frontend' })}>
                    Send Test Message
                </button>
                
                <div>
                    <h3>Messages:</h3>
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
        </>
    );
}
export default Connection;