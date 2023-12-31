import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoomDetail from "./components/room/RoomDetail";
import PostRoom from "./components/room/PostRoom";
import UserProfile from "./components/user/UserProfile";

import Dashboard from "./components/admin/Dashboard";
import Protected from "./hooks/Protected";
import UpdateRoom from "./components/room/UpdateRoom";
import PaymentSuccess from "./pages/payment/PaymentSuccess";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route path="" element={<App />} />

        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/user-profile"
          element={
            <Protected>
              <UserProfile />
            </Protected>
          }
        />
        <Route
          path="/room-detail/:roomId"
          element={
            <Protected>
              <RoomDetail />
            </Protected>
          }
        />
        <Route
          path="/create-room"
          element={
            <Protected>
              <PostRoom />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/updateRoom/:roomId"
          element={
            <Protected>
              <UpdateRoom />
            </Protected>
          }
        />
      </Route>

      <Route path="/payment-success" element={<PaymentSuccess />}></Route>
    </Routes>
    <ToastContainer />
  </BrowserRouter>
);

reportWebVitals();
