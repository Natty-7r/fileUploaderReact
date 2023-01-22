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
import pharmacist from "./pages/pharmacist";
import Pharmacist from "./pages/pharmacist";

const storeDrugs = {
  drugs: [1, 2, 3, 4, 5, 6, 7, 8],
};
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
          element={
            <Coordinator
              storeDrugs={storeDrugs}
              loginHandler={loginHandler}
            />
          }
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
