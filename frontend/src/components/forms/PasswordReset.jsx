

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");

  const authRouter = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (newPassword !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await authRouter.patch("/change-password", {
        currentPassword,
        newPassword,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not change password.");
    }
  }

return (
  <div className="relative min-h-screen w-full bg-primaryLight flex items-center justify-center p-md">
    <div className="absolute top-4 left-4 text-sm text-muted">
      Go Back to{" "}
      <a href="/login" className="font-semibold text-primary hover:underline">
        Login
      </a>
    </div>

    <Card className="w-full max-w-md rounded-lg border border-border bg-backgroundAlt shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Change Password
        </CardTitle>

        <CardDescription className="text-sm text-muted">
          Change your temporary password before continuing.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-4 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Current Password{" "}
              <span className="text-xs font-normal text-muted">
                (Temporary)
              </span>
            </Label>

            <Input
              type="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              New Password
            </Label>

            <Input
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Confirm New Password
            </Label>

            <Input
              type="password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="h-11 rounded border-border bg-white text-sm shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <Button type="submit" className="h-11 w-full rounded text-white">
            Update Password
          </Button>
        </form>
      </CardContent>

      <div className="px-6 pb-6 flex flex-col items-center justify-center gap-sm text-center text-xs text-muted">
        <span>Need to reset a forgotten password?</span>

        <a
          href="mailto:massoncorlette07@gmail.com?subject=Password Reset Request"
          className="font-semibold text-primary hover:underline"
        >
          Contact administrator for Temporary Password
        </a>

        <span className="font-semibold text-primaryDark">
          massoncorlette07@gmail.com
        </span>
      </div>
    </Card>
  </div>
);
}

export default ChangePassword;