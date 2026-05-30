/* eslint-disable react-refresh/only-export-components */
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import { Suspense, lazy, StrictMode } from "react";

const LazyHome = lazy(() => import("./pages/Home"));
const LazyProjects = lazy(() => import("./pages/Projects"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Suspense fallback="Loading...">
          <LazyHome />
        </Suspense>,
      },
      {
        path: "proyectos",
        element: <Suspense fallback="Loading...">
          <LazyProjects />
        </Suspense>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);