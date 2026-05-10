

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-4 left-4 text-sm text-slate-500">
        Go Back to <a href="/login" className="font-semibold text-primary hover:underline">Login</a>
      </div>
      <Card className="bg-white w-full max-w-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Change your temporary password before continuing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Current Password <span className="text-xs text-slate-500">(Temporary)</span></Label>
              <Input
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <Button type="submit" className="text-white w-full">
              Update Password
            </Button>
          </form>
        </CardContent>
        <div className="flex flex-col align-center justify-center gap-sm text-center text-xs text-slate-500">
          <span className="flex items-center justify-center gap-1 text-xs text-slate-500">
            Need to reset a forgotten password?{" "}
          </span>
          <a
            href="mailto:massoncorlette07@gmail.com?subject=Password Reset Request"
            className="flex items-center justify-center font-semibold text-primary hover:underline"
          >
            Contact administrator for Temporary Password
          </a>
          <span className="flex items-center justify-center font-semibold text-primaryDark hover:underline">massoncorlette07@gmail.com</span>
        </div>
      </Card>
    </div>
  );
}

export default ChangePassword;