import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VehicleDetail from "./pages/VehicleDetail";
import PostAd from "./pages/PostAd";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle/:id"
            element={
              <ProtectedRoute>
                <VehicleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-ad"
            element={
              <ProtectedRoute>
                <PostAd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-listing/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
