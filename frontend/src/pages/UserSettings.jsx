import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  UserRound,
  Camera,
  Lock,
  Save,
  Loader2,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";

function SettingsPage() {
  const { user, authRouter, authRouterForm, fetchUpdatedData } =
    useOutletContext();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updatePasswordField = (key, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      setError("Please select an avatar image first.");
      return;
    }

    try {
      setLoadingAvatar(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      await authRouterForm.post("/profile/avatar", formData);

      if (fetchUpdatedData) {
        await fetchUpdatedData(true);
      }

      setSuccess("Profile avatar updated successfully.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to update avatar.");
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    try {
      setLoadingPassword(true);
      setError("");
      setSuccess("");

      await authRouter.patch("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password updated successfully.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to update password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <main className="min-h-100vh bg-primaryLight px-sm md:px-md">
      <div className="mx-auto w-full max-w-5xl p-sm md:p-md">
        <section className="mb-md flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted transition bg-transparent hover:bg-primaryLight hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your profile, avatar, and account security.
          </p>
        </section>

        {(error || success) && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-xl border border-border bg-white p-4 shadow-sm lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground/90">
                Profile
              </h2>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primaryLight text-2xl font-semibold text-primary">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </>
                )}
              </div>

              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h3>

              <p className="mt-1 text-xs text-muted">{user?.email}</p>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-backgroundAlt px-2 py-1 text-xs text-muted">
                <ShieldCheck className="h-3 w-3 text-primary" />
                Manager Account
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-4 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground/90">
                Profile Avatar
              </h2>
            </div>

            <form onSubmit={handleAvatarSubmit} className="grid gap-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-backgroundAlt/50 px-4 py-8 text-center transition hover:bg-primaryLight/40">
                <Camera className="h-8 w-8 text-primary" />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    Upload profile image
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    PNG, JPG, or JPEG recommended.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              {avatarFile && (
                <p className="text-sm text-muted">
                  Selected:{" "}
                  <span className="font-medium text-foreground/80">
                    {avatarFile.name}
                  </span>
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loadingAvatar || !avatarFile}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryDark disabled:pointer-events-none disabled:opacity-50"
                >
                  {loadingAvatar && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save Avatar
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-white p-4 shadow-sm lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground/90">
                Change Password
              </h2>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  updatePasswordField("currentPassword", e.target.value)
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  updatePasswordField("newPassword", e.target.value)
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  updatePasswordField("confirmPassword", e.target.value)
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex justify-end md:col-span-3">
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryDark disabled:pointer-events-none disabled:opacity-50"
                >
                  {loadingPassword && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <Save className="h-4 w-4" />
                  Update Password
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;