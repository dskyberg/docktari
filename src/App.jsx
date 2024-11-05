import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/home";
import Containers from "./routes/containers";
import Images from "./routes/images";
import Volumes from "./routes/volumes";
import Networks from "./routes/networks";
import Term from "./routes/term";

import { homeLoader } from "./data/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home />,
      },
      { path: "containers", element: <Containers /> },
      { path: "images", element: <Images /> },
      { path: "volumes", element: <Volumes /> },
      { path: "networks", element: <Networks /> },
      { path: "term", element: <Term /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
