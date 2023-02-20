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

function App(props) {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  console.log(user);

  return (
    <Router>
      <Header
        auth={auth}
        setAuth={setAuth}
        setUser={setUser}
      />
      <Routes>
        {" "}
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
          element={<Adminn username={user.username} />}
        />
        <Route
          exact
          path="/manger"
          element={<Manager username={user.username} />}
        />
        <Route
          exact
          path="/pharmacist"
          element={<Pharmacist username={user.username} />}
        />
        <Route
          exact
          path="/coordinator"
          element={<Coordinator username={user.username} />}
        />
      </Routes>
    </Router>
  );
}
export default App;
