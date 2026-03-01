"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { handleChangePassword, handleDeleteAccount } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

export default function ProviderAccountSettings() {
    const { logout } = useAuth();

    // ── Change Password ──────────────────────────────────────────────
    const [currentPassword,    setCurrentPassword]    = useState("");
    const [newPassword,        setNewPassword]        = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrent,        setShowCurrent]        = useState(false);
    const [showNew,            setShowNew]            = useState(false);
    const [showConfirm,        setShowConfirm]        = useState(false);
    const [pwLoading,          setPwLoading]          = useState(false);

    // ── Delete Account ───────────────────────────────────────────────
    const [deleteLoading,      setDeleteLoading]      = useState(false);
    const [showDeleteConfirm,  setShowDeleteConfirm]  = useState(false);

    const handlePasswordSubmit = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setPwLoading(true);
        try {
            const res = await handleChangePassword(currentPassword, newPassword, confirmNewPassword);
            if (res.success) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                toast.error(res.message || "Failed to change password");
            }
        } finally {
            setPwLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await handleDeleteAccount();
            if (res.success) {
                toast.success("Account deleted");
                await logout();
            } else {
                toast.error(res.message || "Failed to delete account");
            }
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">

            {/* Change Password card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4 text-[#EE7A40]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Change Password</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Update your password to keep your account secure</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Current password */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={pwLoading}
                                    className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New password */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={pwLoading}
                                    className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm new password */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    disabled={pwLoading}
                                    className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handlePasswordSubmit}
                                disabled={pwLoading}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] hover:brightness-105 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-400 to-rose-400" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Delete Account</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data</p>
                        </div>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-sm px-6 py-3 rounded-xl border border-red-200 transition-colors duration-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete My Account
                        </button>
                    ) : (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <p className="text-sm text-red-700 font-medium mb-4">
                                Are you sure? This is irreversible and will delete all your data including your provider profile.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                                >
                                    {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}