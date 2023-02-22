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

import Header from "./components/adminComponents/header";

import Signup from "./pages/signup.";
import Coordinator from "./pages/coordinator";
import Pharmacist from "./pages/pharmacist";
import Manager from "./pages/manager";
import Supplier from "./pages//supplier";
import Adminn from "./pages/adminn";
import Login from "./pages/signup.";
import Cashier from "./pages/casher";
import Protected from "./RoutProtector";

function App(props) {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("sewiUser"));
    if (!userData) navigate("/");
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
      <Header
        auth={auth}
        setAuth={setAuth}
        setUser={setUser}
      />
      <div>
        <Routes>
          {" "}
          <Route
            exact
            path="/ll"
            element={<Cashier username="naty c" />}
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
        </Routes>
      </div>
    </div>
  );
}
export default App;
