import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initializeStorage } from "./lib/storage";
import { HomePage } from "./pages/HomePage";
import { EventPage } from "./pages/EventPage";

const queryClient = new QueryClient();

// Initialize storage with localStorage provider
initializeStorage("localStorage");

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/event/:eventKey",
    element: <EventPage />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
