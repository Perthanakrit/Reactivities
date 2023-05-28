import {createBrowserRouter, RouteObject} from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/dashboard/ActivityDashboard";
import ActivityForm from "../../features/Form/ActivityForm";
import ActivityDetails from "../../features/details/ActivityDetails";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "activities", element: <ActivityDashboard /> },
      { path: "activities/:id", element: <ActivityDetails /> },
      { path: "createActivity", element: <ActivityForm key='crate' /> },
      { path: "manage/:id", element: <ActivityForm key='manage'/> },
    ],
  },
];
export const router = createBrowserRouter(routes);


