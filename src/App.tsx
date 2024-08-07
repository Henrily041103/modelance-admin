import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import LoginWrapper from "./hooks/useLogin/loginContext";
import AdminConsole from "./pages/console";
import TransactionPage from "./pages/console/transactions";
import UserPage from "./pages/console/users";
import StatisticsPage from "./pages/console/statistics";

const router = createHashRouter([
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
        element: <StatisticsPage />,
      },
      {
        path: "transaction",
        element: <TransactionPage />,
      },
      {
        path: "statistics",
        element: <StatisticsPage />,
      },
      {
        path: "users",
        element: <UserPage />,
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

