import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("authToken");

    navigate("/SignIn");
  }, [navigate]);

  return null; 
};

export default SignOut;
