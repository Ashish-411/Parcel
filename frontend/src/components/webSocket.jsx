import { useState,useEffect,useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
function webSocket(){
    const {token} = useAuth();
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        if(!token){
            console.log("No token available");
            return;
        }
        //web socket url adjust
        const wsUrl = `ws://localhost:8000/ws?token=${token}`;
    
        const ws = new webSocket(wsUrl);
    
        wsRef.current = ws;
    
        //connection opened
    
        ws.open = () =>{
            console.log("web socket connected");
            setIsConnected(true);
    
            ws.send(JSON.stringify({type: 'auth', token: token}));
        };
    
        //listen message
    
        ws.onmessage = (event) =>{
            console.log("Message Received", event.data);
            setMessages( prev => [...prev, event.data]);
        };
    
        //connection closed
        ws.onclose = () =>{
            console.log("connection closed");
            setIsConnected(false);
        }
    
        //on error
        ws.onerror = (error) =>{
            console.error("Websocker error:",error);
        }
    
        //cleanup on unmount
        return () =>{
            if(ws.readyState === WebSocket.OPEN){
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
                <button onClick={() => sendMessage({ type: 'ping', data: 'Hello' })}>
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
export default webSocket;