import {useState, useEffect, useRef} from "react";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
function Broadcast(){
    const {token} = useAuth();
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [roomId,setRoomId] = useState("");

    const handleClick = () =>{
        if(!token){
            console.log("No token available");
            return;
        }

        if(!roomId){
            alert("Please Enter Room Id");
            return;
        }
        // Close existing connection if any
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("Closing existing connection");
            wsRef.current.close();
        }
        const decoded = jwtDecode(token);
        const id = decoded.id;

        //web socket url adjust
        const wsUrl = `ws://localhost:8000/ws/broadcast/${id}/${roomId}?token=${token}`;
    
        const ws = new WebSocket(wsUrl);
    
        wsRef.current = ws;
        ws.onopen = () =>{
            console.log("web socket connected");
            setIsConnected(true);

        };
        // Listen for messages
        ws.onmessage = (event) => {
            console.log("📨 Message Received:", event.data);
            setMessages(prev => [...prev, event.data]);
        };

        // Connection closed
        ws.onclose = (event) => {
            console.log("❌ Connection closed");
            console.log("   Close code:", event.code);
            console.log("   Close reason:", event.reason);
            console.log("   Was clean:", event.wasClean);
            
            setIsConnected(false);
            
            if (event.code === 1008 || event.code === 1011 || event.code === 1006) {
                alert(`You cannot enter this room: ${event.reason || "Access denied"}`);
                console.error("Policy violation:", event.reason);
            }
        };

        // On error
        ws.onerror = (error) => {
            console.error("⚠️ WebSocket error:", error);
            alert("WebSocket connection error occurred");
        };
    }

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log("🧹 Cleaning up WebSocket on unmount");
                wsRef.current.close();
            }
        };
    }, []);

    const handleDisconnect = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
            setIsConnected(false);
            console.log("Disconnected from room");
        }
    };

    
           
        //const tempToken = "jkdjfkdjfdkjfdkjdfkdfkd";

    
    return (
        <div>
            <h2>Broadcast Room</h2>
            
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isConnected}
                />
                
                {!isConnected ? (
                    <button type="button" onClick={handleClick}>
                        Enter Room
                    </button>
                ) : (
                    <button type="button" onClick={handleDisconnect}>
                        Leave Room
                    </button>
                )}
            </div>

            <div>
                <p>Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
            </div>

            <div>
                <h3>Messages:</h3>
                <div style={{ 
                    border: "1px solid #ccc", 
                    padding: "10px", 
                    minHeight: "200px",
                    maxHeight: "400px",
                    overflowY: "auto" 
                }}>
                    {messages.length === 0 ? (
                        <p>No messages yet...</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: "8px" }}>
                                {msg}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Broadcast;