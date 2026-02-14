import { createContext, useContext, useState } from "react";

const RequestContext = createContext();

export const useRequest = () => useContext(RequestContext);

export function RequestProvider({children}){
    const [requestData,setRequestData] = useState(null);

    const setRequest = (data) => setRequestData(data);
    const clearRequest = () => setRequestData(null);

    return(
        <RequestContext.Provider value = {
            {
                requestData,
                setRequest,
                clearRequest
            }}>
            {children}
        </RequestContext.Provider>
    );
}