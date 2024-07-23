import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import LoginWrapper from "./hooks/useLogin/loginContext";
import AdminConsole from "./pages/console";
import TransactionPage from "./pages/console/transactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/console",
    element: <AdminConsole />,
    children: [
      {
        index: true,
        element: <div>Statistics page</div>,
      },
      {
        path: "transaction",
        element: <TransactionPage />,
      },
      {
        path: "statistics",
        element: <div>Statistics page</div>,
      },
      {
        path: "users",
        element: <div>Users page</div>,
      },
      {
        path: "contracts",
        element: <div>Contracts page</div>,
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

