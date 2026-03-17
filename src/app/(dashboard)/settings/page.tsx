"use client";

import { useState, useRef } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/animations";
import { Avatar } from "@/components/ui/avatar";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Camera, Save, Key, Shield, Mail, Moon, User } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { data: profile, refetch } = api.user.getProfile.useQuery();
  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameInit, setNameInit] = useState(false);

  if (profile && !nameInit) {
    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
    setNameInit(true);
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setProfileMsg("Profile updated successfully!");
      utils.user.getProfile.invalidate();
      setTimeout(() => setProfileMsg(""), 3000);
    },
    onError: (e) => setProfileMsg(e.message),
  });

  const changePassword = api.user.changePassword.useMutation({
    onSuccess: () => {
      setPasswordMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    },
    onError: (e) => setPasswordMsg(e.message),
  });

  const updateAvatar = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      utils.leaderboard.getLeaderboard.invalidate();
      setAvatarUploading(false);
    },
    onError: () => setAvatarUploading(false),
  });

  const updatePrefs = api.user.updatePreferences.useMutation({
    onSuccess: () => utils.user.getProfile.invalidate(),
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      alert("Only JPEG, PNG, WebP, and GIF files are allowed");
      return;
    }
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateAvatar.mutate({ image: base64 });
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    if (!name.trim() || !email.trim()) return;
    updateProfile.mutate({ name: name.trim(), email: email.trim() });
  }

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters");
      return;
    }
    changePassword.mutate({ currentPassword, newPassword });
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Settings" />
      <div className="max-w-[640px] mx-auto px-8 py-8">
        <FadeIn>
          <h1 className="text-[28px] font-heading font-bold text-text-primary tracking-tight mb-1">
            Settings
          </h1>
          <p className="text-text-secondary text-[15px] mb-8">
            Manage your profile, password, and preferences.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={16} className="text-accent" />
              <h2 className="font-heading font-medium text-[15px]">Profile</h2>
            </div>

            <div className="flex items-center gap-5 mb-6">
              <div className="relative group">
                <Avatar
                  src={profile?.image}
                  name={profile?.name ?? "U"}
                  size="lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  {avatarUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={18} className="text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-[14px] font-medium text-text-primary">{profile?.name ?? "User"}</p>
                <p className="text-[12px] text-text-muted">{profile?.email}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Click photo to change avatar (max 2MB)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
            </div>

            {profileMsg && (
              <p className={`text-[13px] mt-3 ${profileMsg.includes("success") ? "text-success" : "text-danger"}`}>
                {profileMsg}
              </p>
            )}

            <Button
              className="mt-4"
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
            >
              <Save size={14} />
              {updateProfile.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Key size={16} className="text-accent" />
              <h2 className="font-heading font-medium text-[15px]">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-9 px-3 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 px-3 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-9 px-3 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
            </div>

            {passwordMsg && (
              <p className={`text-[13px] mt-3 ${passwordMsg.includes("success") ? "text-success" : "text-danger"}`}>
                {passwordMsg}
              </p>
            )}

            <Button
              className="mt-4"
              onClick={handleChangePassword}
              disabled={changePassword.isPending || !currentPassword || !newPassword}
            >
              <Key size={14} />
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </Button>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={16} className="text-accent" />
              <h2 className="font-heading font-medium text-[15px]">Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-text-muted" />
                  <div>
                    <p className="text-[14px] text-text-primary">Email Reminders</p>
                    <p className="text-[12px] text-text-muted">Get notified about streaks and new content</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePrefs.mutate({ emailReminders: !profile?.preferences?.emailReminders })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${profile?.preferences?.emailReminders ? "bg-accent" : "bg-bg-elevated border border-border"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${profile?.preferences?.emailReminders ? "translate-x-[18px]" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon size={15} className="text-text-muted" />
                  <div>
                    <p className="text-[14px] text-text-primary">Dark Mode Lock</p>
                    <p className="text-[12px] text-text-muted">Keep the interface in dark mode always</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePrefs.mutate({ darkModeLock: !profile?.preferences?.darkModeLock })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${profile?.preferences?.darkModeLock ? "bg-accent" : "bg-bg-elevated border border-border"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${profile?.preferences?.darkModeLock ? "translate-x-[18px]" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-text-muted" />
              <h2 className="font-heading font-medium text-[15px] text-text-secondary">Account Info</h2>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-text-muted">Member since</span>
                <span className="text-text-secondary">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">User ID</span>
                <span className="text-text-secondary font-mono text-[11px]">{profile?.id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Level</span>
                <span className="text-text-secondary">Lv.{profile?.level ?? 1} {profile?.levelName ?? "Rookie"}</span>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
