import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { z } from "zod";
import { HeartHandshake } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginSchema = z.object({
    username: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  // clear token on mount
  //localStorage.removeItem("usertoken");

  const isDemo = import.meta.env.VITE_APP_MODE === "demo";



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Google sign in failed");
        return;
      }

      localStorage.setItem("usertoken", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google sign in failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // catching any validation errors before sending req to backend, where validation chain is also implemented for security and data integrity on backend
    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(async (response) => {
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (response.status === 401) {
        setError("Wrong email or password");
        return;
      }

      if (response.status > 401) {
        setError("server error");
        return;
      }

      localStorage.setItem("usertoken", data.token);

      if (data.user?.mustChangePassword) {
        navigate("/change-password");
        return;
      }

      if (!data.error) {
        navigate("/dashboard");
        return;
      }
    });
  };

  const handleDemoLogin = async () => {
    setUsername("guest@sheltertracker.com");
    setPassword("password123");
    
    await fetch(`${import.meta.env.VITE_API_URL}/`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "guest@sheltertracker.com", password: "password123" }),
    }).then(async (response) => {
    const data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    if (response.status === 401) {
      setError("Wrong email or password");
      return;
    }

    if (response.status > 401) {
      setError("server error");
      return;
    }

    localStorage.setItem("usertoken", data.token);

    if (data.user?.mustChangePassword) {
      navigate("/change-password");
      return;
    }

    if (!data.error) {
      navigate("/dashboard");
      return;
    }

    if (data.error) {
      setError(data.error);
      return;
    }

  });
  };

 return (
  <div className="min-h-screen w-full bg-primaryLight flex items-center justify-center p-md">
    <div className="w-full min-h-[100vh] bg-backgroundAlt rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
      <div className="md:flex flex-1 relative bg-secondary">
        <img
          src="/HouseDesign.png"
          alt=""
          className="absolute opacity-70 inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-lg">
          <div>
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primaryLight text-red-500 shadow-sm">
              <HeartHandshake className="h-4 w-4 md:h-6 md:w-6" />
            </div>
            <h1 className="shelter-ledger-logo font-semibold text-primaryDark tracking-[-0.045em]">
              ShelterLedger
            </h1>

            <p className="m-2 text-sm text-center text-slate-600 italic">
              Clearer records. Organized data. Better outcomes.
            </p>
          </div>

          <div className="rounded-lg border border-white/70 bg-white/80 p-sm sm:p-md shadow-sm backdrop-blur">
            <p className="text-xs sm:text-sm text-muted text-center">
              Secure. Private. Built for shelters and service providers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center bg-backgroundAlt px-lg py-lg sm:px-10 md:px-16">

        <CardHeader className="px-0 pb-6 pt-0">
          <CardTitle className="color-primaryDark text-xl font-bold md:text-2xl text-left">
            Welcome
          </CardTitle>

          <CardDescription className="border-b pb-sm border-border text-sm text-left text-muted">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {error && (
            <span className="mb-4 block text-center text-sm text-destructive">
              Error was encountered: {error}
            </span>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email address
              </Label>

              <Input
                id="email"
                name="username"
                type="text"
                placeholder="Enter your email"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border"
                />
                Remember me
              </label>

              <button
                onClick={() => navigate("/change-password")}
                type="button"
                className="bg-transparent font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="h-11 w-full rounded text-white hover:brightness-110 bg-primary shadow-sm">
              Continue
            </Button>            
            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {isDemo ? (
              <Button
                type="button"
                onClick={handleDemoLogin}
                className="h-11 w-full rounded bg-primary text-white shadow-sm hover:bg-primaryDark"
              >
                Enter Demo Dashboard
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded border-primary/20 bg-primaryLight text-primary hover:border-accentOrange hover:bg-accentOrange hover:text-white"
                onClick={() => {
                  window.location.href =
                    "https://shelter-resource-tracker-demo.vercel.app/";
                }}
              >
                View Live Demo
              </Button>
            )}

            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-lg">
              <div className="flex w-full justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign in failed")}
                  className="w-full rounded"
                />
              </div>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-1 text-center text-sm text-muted">
            <span>Don&apos;t have an account?</span>

            <Link
              to="/sign-up"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>

        </CardContent>
        {isDemo ? (
          <p className="text-[10px] sm:text-xs text-muted mt-6 text-center">
            Demo environment only. All client data and records are fictional
            and created for demonstration purposes. No real client data is used.
          </p>
        ) : (
        <p className="text-[10px] sm:text-xs mt-6 text-muted">
          Authorized staff access only. Client information should be handled according
          to organizational privacy and data security policies.
        </p>
        )}
      </div>

    </div>
  </div>
);
}

export default Login;