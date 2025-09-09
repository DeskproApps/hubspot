import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogoutEvent } from "../../hooks";

export default function LogoutEventListener() {
  const { logoutEvent, setLogoutEvent } = useLogoutEvent()
  const navigate = useNavigate()

  useEffect(() => {
    if (logoutEvent === true) {
      // The login page resets the event.
      navigate("/login");
    }
  }, [logoutEvent, navigate, setLogoutEvent]);

  return (<>
    <Outlet />
  </>)
}
