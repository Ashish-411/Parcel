export function getUserLocation(){
    return new Promise((resolve,reject) =>{
        if(!navigator.geolocation){
            reject(new Error("Geo Location is not supported by your browser"));
        }else{
            navigator.geolocation.getCurrentPosition(
                (position) =>{
                    resolve ({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error)=>{
                    reject(error);
                },{
                    enableHighAccuracy: true, // more precise
                    timeout: 10000,           // 10 seconds max
                    maximumAge: 0,            // do not use cached position
                }
            );
        }
    });
}