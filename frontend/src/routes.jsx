import App from "./App"; 
import DashBoardLayout from "./pages/DashBoardLayout"; 
import DashBoard from "./pages/DashBoard";
import ErrorPage from "./pages/ErrorPage";
import Login from "./components/forms/LoginForm";
import Signup from "./components/forms/SignupForm";
import Records from "./pages/Records";
import ClientProfile from "./pages/ClientProfile";
import ChangePassword from "./components/forms/PasswordReset";
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
        path: "change-password",
        element: <ChangePassword />,
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
            path: "records",
            element: <Records/>
          },
          {
            path: "clients/:clientId",
            element: <ClientProfile/>
          }
        ]
      },
    ]
  },

];

export default routes;