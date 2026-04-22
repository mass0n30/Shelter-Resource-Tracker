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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">

        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {error && (
            <span className="text-red-500 text-sm">
              Error was encountered: {error}
            </span>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="username"
                type="text"
                placeholder="Enter Email"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>

          <div className="flex items-center justify-between text-sm">
            <span>Not a member?</span>
            <Link to="/sign-up">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default Login;