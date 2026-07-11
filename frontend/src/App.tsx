import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StudentsPage } from "@/pages/StudentsPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>

    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
