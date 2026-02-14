import { useEffect,useRef,useState } from "react";
import api from "../api";
import { getUserLocation } from "../utils/Location";
import { useAuth } from "../contexts/AuthContext";
import { useRequest } from "../contexts/RequestContext";
function Requests(){
    const [requests, setRequests] = useState([]);
    const [notification, setNotification] = useState(null);
    const {token,user} = useAuth();
    const {requestData} = useRequest();

    const socketRef = useRef(null);

    useEffect(()=>{
        //fetchRequests();
        if(!user){
            console.log("user not loaded");
            return;
        }
        console.log("user"+user.id)
        if (socketRef.current) return; // prevent recreation

        socketRef.current = new WebSocket(`ws://localhost:8000/api/parcel/receive_notification/${user.id}?token=${token}`);
        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
    
          console.log("Received notification",data);
          setNotification(data);
        };
        socketRef.current.onerror=(err)=>{
            console.log(err);
        }
        socketRef.current.onclose = (message) =>
            {
                console.log("WebSocket closed",message);

            } 
                

        return () => {
          socketRef.current?.close(); // closes when leaving page
          socketRef.current = null;
        };
    },[user?.id]);

    async function fetchRequests() {
    try {
      const res = await api.get("api/parcel/received-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests");
    }
  }

  async function handleAccept() {
    if(!notification){
        return;
    }
    try {
      const location = await getUserLocation();
      console.log(location);

      await api.post(`/api/parcel/accept`, {
        request_id: notification.request_id,
        receiver_location: [location.lat, location.lng],
      });

    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  }

  async function handleReject() {
    if(!notification){
        return;
    }
    try {
      await api.post(`/api/parcel/decline/?request_id=${notification.request_id}`);
    } catch (err) {
      console.error("Error rejecting request");
    }
  }
    return (
        <div>
            {notification ? (
              <div>
                  <h2>Parcel Requests</h2>
                  <div key={notification.request_id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
                          <p><strong>{notification.sender_name}</strong> sent parcel request</p> <br/>        
                          <>
                              <button onClick={() => handleAccept()}>
                                  Accept
                              </button>
      
                              <button onClick={() => handleReject()}>
                                  Reject
                              </button>
                              </>
                          </div> 
              </div> 
      
            ):(<p>No notification</p>)}
        </div>
    
    );

}
export default Requests;