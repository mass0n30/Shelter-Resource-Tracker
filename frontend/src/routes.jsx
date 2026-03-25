import App from "./App"; 
import DashBoardLayout from "./pages/DashBoardLayout"; 
import DashBoard from "./pages/DashBoard";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientProfile from "./pages/ClientProfile";

const routes = [
  {
    path: "/", 
    element: <App />, 
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // default render
        element:<Login/>,         
      },
      {
        path: "login",
        element:<Login/>
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
      {
        path: "dashboard",
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            element: <DashBoard/>
          },
          {
           path: "profile/:clientId",
            element: <ClientProfile/>
          }
        ]
      },
    ]
  },

];

export default routes;