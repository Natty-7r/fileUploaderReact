import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  redirect,
  Routes,
  Navigate,
  Navigator,
  useNavigate,
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

  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("sewiUser"));
    if (!userData) navigate("/ll");
    else if (!userData.auth) navigate("/");
    else {
      setUser(userData.user);
      setAuth(userData.auth);
      navigate(`/${userData.user.role}`);
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
            path="/ll"
            element={<Customer username="user" />}
          />
          <Route
            exact
            path="/"
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
