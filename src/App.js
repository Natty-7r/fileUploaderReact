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
  const [path, setPath] = useState("/");

  return (
    <Router>
      <Header setPath={setPath} />
      <Routes>
        {" "}
        <Route
          exact
          path="/"
          setPath={setPath}
          element={<Login />}
        />
        <Route
          exact
          path="/admin"
          element={<Adminn />}
        />
        <Route
          exact
          path="/manger"
          element={<Manager />}
        />
        <Route
          exact
          path="/pharmacist"
          element={<Pharmacist />}
        />
        <Route
          exact
          path="/coordinator"
          element={<Coordinator />}
        />
      </Routes>
    </Router>
  );
}
export default App;
