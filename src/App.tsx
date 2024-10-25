import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initializeStorage } from "./lib/storage";
import { HomePage } from "./pages/HomePage";
import { EventPage } from "./pages/EventPage";

// Initialize storage before any React code runs
const s3BucketUrl = import.meta.env.VITE_S3_BUCKET_URL;

if (s3BucketUrl) {
  console.log("Using S3 storage provider");
  initializeStorage({
    type: "s3",
    bucketUrl: s3BucketUrl,
  });
} else {
  console.log("Using localStorage provider");
  initializeStorage({
    type: "localStorage",
  });
}

// Initialize React Query client
const queryClient = new QueryClient();

// Set up router
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
