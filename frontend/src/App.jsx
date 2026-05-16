import { Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main>
        <Outlet />
      </main>
    </GoogleOAuthProvider>
  );
}

export default App;
