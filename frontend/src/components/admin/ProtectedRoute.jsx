import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {user} = useSelector(store=>store.auth);
  
    console.log(user,"user in protected route");
    

    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null ){
            navigate("/login");
        }
    },[]);

    return (
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;