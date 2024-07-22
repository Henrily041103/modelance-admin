import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import LoginWrapper from "./hooks/useLogin/loginContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/console",
    element: (
      <div>
        <div>Logged in</div>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <div>Statistics page</div>,
      },
      {
        path: "transactions",
        element: <div>Transaction page</div>,
      },
      {
        path: "account",
        element: <div>Account page</div>,
      },
      {
        path: "job",
        element: <div>Job page</div>,
      },
      {
        path: "contract",
        element: <div>Contract page</div>,
      },
    ],
  },
]);

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginWrapper>
        <RouterProvider router={router} />
      </LoginWrapper>
    </QueryClientProvider>
  );
}

export default App;

