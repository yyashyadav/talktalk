import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";
import { getAdmin } from "./redux/thunks/admin";
import SelectionContextMenu from './components/shared/SelectionContextMenu';
import InitialLoader from './components/layout/InitialLoader';

// Lazy load components with preload
const lazyWithPreload = (importFn) => {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
};

// Lazy load pages with preload
const Home = lazyWithPreload(() => import("./pages/Home"));
const Login = lazyWithPreload(() => import("./pages/Login"));
const Chat = lazyWithPreload(() => import("./pages/Chat"));
const Groups = lazyWithPreload(() => import("./pages/Groups"));
const NotFound = lazyWithPreload(() => import("./pages/NotFound"));

const AdminLogin = lazyWithPreload(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazyWithPreload(() => import("./pages/admin/Dashboard"));
const UserManagement = lazyWithPreload(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazyWithPreload(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazyWithPreload(() => import("./pages/admin/MessageManagement"));

// Preload function for routes
const preloadRoute = (route) => {
  const components = {
    '/': Home,
    '/login': Login,
    '/chat': Chat,
    '/groups': Groups,
    '/admin': AdminLogin,
    '/admin/dashboard': Dashboard,
    '/admin/users': UserManagement,
    '/admin/chats': ChatManagement,
    '/admin/messages': MessagesManagement,
  };

  if (components[route]) {
    components[route].preload();
  }
};

const AppContent = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/user/me`, { 
          withCredentials: true 
        });
        dispatch(userExists(data.user));
      } catch (err) {
        dispatch(userNotExists());
      } finally {
        setIsAppReady(true);
      }
    };

    // Always check auth on mount and when pathname changes
    checkAuth();
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin') {
      dispatch(getAdmin());
    }
  }, [dispatch, location.pathname]);

  // Preload next likely routes
  useEffect(() => {
    const nextRoutes = {
      '/': ['/chat', '/groups'],
      '/login': ['/'],
      '/chat': ['/groups', '/'],
      '/groups': ['/chat', '/'],
      '/admin': ['/admin/dashboard'],
      '/admin/dashboard': ['/admin/users', '/admin/chats'],
    };

    if (nextRoutes[location.pathname]) {
      nextRoutes[location.pathname].forEach(route => preloadRoute(route));
    }
  }, [location.pathname]);

  // Handle loading state
  useEffect(() => {
    if (isAppReady && !loader) {
      setIsLoading(false);
    }
  }, [isAppReady, loader]);

  // Show loader until everything is ready
  if (isLoading) {
    return <InitialLoader isLoading={true} />;
  }

  // If not authenticated and not on login page, redirect to login
  if (!user && location.pathname !== '/login' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route
        element={
          <SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/groups" element={<Groups />} />
      </Route>

      <Route
        path="/login"
        element={
          <ProtectRoute user={!user} redirect="/">
            <Login />
          </ProtectRoute>
        }
      />

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/chats" element={<ChatManagement />} />
      <Route path="/admin/messages" element={<MessagesManagement />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<InitialLoader isLoading={true} />}>
        <AppContent />
      </Suspense>
      <Toaster position="bottom-center" />
      <SelectionContextMenu />
    </BrowserRouter>
  );
};

export default App;
