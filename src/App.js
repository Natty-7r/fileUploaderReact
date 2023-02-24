import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  redirect,
  Routes,
  Navigate,
  Navigator,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/header";

import Coordinator from "./pages/coordinator";
import Pharmacist from "./pages/pharmacist";
import Manager from "./pages/manager";
import Supplier from "./pages//supplier";
import Adminn from "./pages/admin";
import Login from "./pages/login";
import Cashier from "./pages/casher";
import Customer from "./pages/customer";
import Protected from "./RoutProtector";

function App(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname == "/") navigate("/");
    else {
      const userData = JSON.parse(localStorage.getItem("sewiUser"));
      if (!userData) navigate("/login");
      else if (!userData.auth) navigate("/login");
      else {
        setUser(userData.user);
        setAuth(userData.auth);
        navigate(`/${userData.user.role}`);
      }
    }
  }, []);

  return (
    <div>
      {" "}
      {auth ? (
        <Header
          auth={auth}
          setAuth={setAuth}
          setUser={setUser}
        />
      ) : null}
      <div>
        <Routes>
          {" "}
          <Route
            exact
            path="/"
            element={<Customer username="user" />}
          />
          <Route
            exact
            path="/login"
            element={
              <Login
                setAuth={setAuth}
                setUser={setUser}
              />
            }
          />
          <Route
            exact
            path="/admin"
            element={
              <Protected auth={auth}>
                {" "}
                <Adminn username={user.username} />
              </Protected>
            }
          />
          <Route
            exact
            path="/manager"
            element={
              <Protected auth={auth}>
                {" "}
                <Manager username={user.username} />
              </Protected>
            }
          />
          <Route
            exact
            path="/pharmacist"
            element={
              <Protected auth={auth}>
                {" "}
                <Pharmacist username={user.username} />
              </Protected>
            }
          />
          <Route
            exact
            path="/coordinator"
            element={
              <Protected auth={auth}>
                {" "}
                <Coordinator username={user.username} />
              </Protected>
            }
          />
          <Route
            exact
            path="/supplier"
            element={
              <Protected auth={auth}>
                {" "}
                <Supplier username={user.username} />
              </Protected>
            }
          />
          <Route
            exact
            path="/cashier"
            element={
              <Protected auth={auth}>
                {" "}
                <Cashier username={user.username} />
              </Protected>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
export default App;
