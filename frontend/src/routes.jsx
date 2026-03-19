import App from "./App"; 
import Home from "./pages/Home"; 
import ErrorPage from "./components/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";

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
        path: "home",
        element: <Home />,
        children: [
          {
            index: true,
            element: <HomePage/> 
          },
        //  {
         //   path: "post/:postId",
        //    element: <PostDetails/>
        //  }
        ]
      },
    ]
  },

];

export default routes;