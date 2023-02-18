import { useState } from "react";
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
import Admin from "./pages/admin";
import Signup from "./pages/signup.";
import Login from "./pages/login.js";
import Coordinator from "./pages/coordinator";
import Pharmacist from "./pages/pharmacist";
import Manager from "./pages/manager";
import Supplier from "./pages//supplier";
import Adminn from "./pages/adminn";

function App(props) {
  const loginHandler = () => {
    console.log("login clicked");
  };
  return (
    <Router>
      <Header />
      <Routes>
        {" "}
        <Route
          path="/"
          element={<Adminn loginHandler={loginHandler} />}
        />
        <Route
          path="/"
          element={<Admin />}
        />
      </Routes>
    </Router>
  );
}
export default App;
