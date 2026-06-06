import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function SignUp() {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    alias: "",
    email: "",
    password: "",
    passwordconfirm: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signUpSchema = z
  .object({
    fname: z.string().min(1, "First name is required"),
    lname: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordconfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordconfirm, {
    path: ["passwordconfirm"],
    message: "Passwords do not match",
  });


  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = signUpSchema.safeParse(user);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sign-up`, {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: user.fname,
          lastname: user.lname,
          username: user.email,
          password: user.password,
          passwordconfirm: user.passwordconfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors || ["Something went wrong"]);
        return;
      }

      if (response.ok || response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError([{ msg: "Network or server error" }]);
    }
  };

  const updateInfo = (value, propType) => {
    setUser({ ...user, [propType]: value });
  };

  return (
  <div className="min-h-screen w-full bg-primaryLight flex items-center justify-center p-md">
    <div className="w-full min-h-[100vh] bg-backgroundAlt rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 relative bg-secondary">
        <img
          src="/HouseDesign.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-lg">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary text-primary">
              <span className="text-xl font-bold">⌂</span>
            </div>

            <h1 className="text-xl font-bold text-foreground">
              Shelter Resource Tracker
            </h1>

            <p className="mt-1 text-sm text-center text-muted">
              Bringing a supportive community together.
            </p>
          </div>

          <div className="rounded-lg border border-white/70 bg-white/80 p-md shadow-sm backdrop-blur">
            <p className="text-sm text-muted text-center">
              Secure. Private. Built for shelters and service providers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center bg-backgroundAlt px-lg py-lg sm:px-10 md:px-16">
        <div className="mb-8 flex flex-col items-center text-center md:hidden">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary text-primary">
            <span className="text-xl font-bold">⌂</span>
          </div>

          <h1 className="text-lg font-bold text-foreground">
            Shelter Resource Tracker
          </h1>

          <p className="mt-2 max-w-[240px] text-sm text-muted">
            Bringing a supportive community together.
          </p>
        </div>

        <CardHeader className="px-0 pb-6 pt-0">
          <CardTitle className="text-2xl font-bold text-left tracking-tight text-foreground">
            Create account
          </CardTitle>

          <CardDescription className="border-b pb-sm border-border text-sm text-left text-muted">
            Create your account to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {error && (
            <span className="mb-4 block text-center text-sm text-destructive">
              Error was encountered: {error}
            </span>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-xs font-semibold text-foreground">
                  First name
                </Label>

                <Input
                  id="firstname"
                  placeholder="First name"
                  onChange={(e) => updateInfo(e.target.value, "fname")}
                  className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-xs font-semibold text-foreground">
                  Last name
                </Label>

                <Input
                  id="lastname"
                  placeholder="Last name"
                  onChange={(e) => updateInfo(e.target.value, "lname")}
                  className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => updateInfo(e.target.value, "email")}
                className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                onChange={(e) => updateInfo(e.target.value, "password")}
                className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordconfirm" className="text-xs font-semibold text-foreground">
                Repeat password
              </Label>

              <Input
                id="passwordconfirm"
                type="password"
                placeholder="Repeat your password"
                onChange={(e) => updateInfo(e.target.value, "passwordconfirm")}
                className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <Button type="submit" className="h-11 w-full rounded text-white">
              Create account
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1 text-center text-sm text-muted">
            <span>Already have an account?</span>

            <Link to="/" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  </div>
);
}

export default SignUp;