import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import AIRecs from "./pages/AIRecs";
import AIRecDetail from "./pages/AIRecDetail";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import Profile from "./pages/Account/Profile";
import UserProfile from "./pages/Account/UserProfile";
import Settings from "./pages/Account/Settings";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";

import TravelLogForm from "./pages/TravelLogForm";
import UploadPhoto from "./pages/UploadPhoto.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/ai-recs" element={<AIRecs />} />
                <Route path="/ai-recs/:id" element={<AIRecDetail />} />
                <Route path="/account/login" element={<Login />} />
                <Route path="/account/register" element={<Register />} />
                <Route
                  path="/account/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <Report />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/travel/new"
                  element={
                    <ProtectedRoute>
                      <TravelLogForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gallery/upload"
                  element={
                    <ProtectedRoute>
                      <UploadPhoto />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;