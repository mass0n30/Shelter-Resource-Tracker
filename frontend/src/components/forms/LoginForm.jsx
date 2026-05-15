import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { z } from "zod";

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
  localStorage.removeItem("usertoken");

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

  const handleGuestSubmit = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/home/guest`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!data.error) {
        navigate("/home");
      }
    });
  };

  return (
<div className="min-h-full flex-1 w-full flex items-start justify-center bg-white/50 px-4 py-12">
  <Card className="relative overflow-hidden w-full max-w-5xl min-h-[680px] rounded-2xl border border-border/70 bg-white shadow-xl md:grid md:grid-cols-[48%_52%]">

        <div className="relative hidden min-h-[720px] overflow-hidden bg-blue-50 md:block">
          <img
            src="/HouseDesign.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-white/10" />

          <div className="relative z-10 p-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary text-primary">
              <span className="text-xl font-bold">⌂</span>
            </div>

            <h1 className="text-xl font-bold text-slate-950">
              Shelter Resource Tracker
            </h1>

            <p className="mt-1 text-sm text-slate-600 mt-1 text-sm text-slate-500 w-full flex-1 align-center text-center">
              Bringing a supportive community together.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 right-10 z-10 rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-primary">
                <span className="text-sm">◇</span>
              </div>

            <p className="mt-1 text-sm text-slate-500 w-full flex-1 align-center text-center">
                Secure. Private. Built for shelters and service providers.
              </p>
            </div>
          </div>
        </div>


    {/* RIGHT LOGIN PANEL */}
    <div className="relative flex min-h-[640px] flex-col overflow-hidden bg-white px-6 py-8 sm:px-10 md:px-16 md:py-20">

      {/* MOBILE BRAND HEADER */}
      <div className="relative z-10 mb-10 flex flex-col items-center text-center md:hidden">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary text-primary">
          <span className="text-xl font-bold">⌂</span>
        </div>

        <h1 className="text-lg font-bold leading-tight text-slate-950">
          Shelter <br /> Resource Tracker
        </h1>

        <p className="mt-2 max-w-[220px] text-sm text-slate-500 w-full align-center text-center">
          Bringing a supportive community together.
        </p>
      </div>

      <CardHeader className="relative z-10 px-0 pb-6 pt-0">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
          Welcome back
        </CardTitle>

        <CardDescription className="text-sm text-slate-500 ">
          Sign in to continue to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-0">
        {error && (
          <span className="mb-4 block text-sm text-red-500 w-full text-center">
            Error was encountered: {error}
          </span>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Email address
            </Label>

            <Input
              id="email"
              name="username"
              type="text"
              placeholder="Enter your email"
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-md border-slate-200 bg-white text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-md border-slate-200 bg-white text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300"
              />
              Remember me
            </label>

            <button
              onClick={() => navigate("/change-password")}
              type="button"
              className="font-semibold bg-transparent text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="h-11 w-full text-white rounded-md">
            Continue
          </Button>

          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-md border-slate-200 bg-white"
          >
            Sign in with Google
            <img src="/google.png" alt="Google logo" className="ml-2 h-4" />
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-1 text-sm text-slate-500">
          <span>Don&apos;t have an account?</span>

          <Link to="/sign-up" className="font-semibold text-primary hover:underline">
            Contact your administrator
          </Link>
        </div>
      </CardContent>

      {/* MOBILE BOTTOM ILLUSTRATION */}
      <img
        src="/HouseDesign.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-full max-w-[420px] -translate-x-1/2 opacity-90 md:hidden"
      />
    </div>
  </Card>
</div>
  );
}

export default Login;