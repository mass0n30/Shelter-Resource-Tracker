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
    alias: z.string().min(3, "Username must be at least 3 characters"),
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
      const response = await fetch("http://localhost:5000/sign-up", {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: user.fname,
          lastname: user.lname,
          alias: user.alias,
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">

        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started.
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
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                placeholder="First Name"
                onChange={(e) => updateInfo(e.target.value, "fname")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                placeholder="Last Name"
                onChange={(e) => updateInfo(e.target.value, "lname")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => updateInfo(e.target.value, "email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alias">Username</Label>
              <Input
                id="alias"
                placeholder="Username"
                onChange={(e) => updateInfo(e.target.value, "alias")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => updateInfo(e.target.value, "password")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordconfirm">Repeat Password</Label>
              <Input
                id="passwordconfirm"
                type="password"
                placeholder="Repeat Password"
                onChange={(e) => updateInfo(e.target.value, "passwordconfirm")}
              />
            </div>

            <div className="flex gap-2 pt-2 justify-center">
              <Button type="submit">
                Sign Up
              </Button>

              <Link to="/">
                <Button type="button" variant="secondary">
                  Login
                </Button>
              </Link>
            </div>

          </form>

        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;