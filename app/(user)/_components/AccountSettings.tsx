"use client";

import { useState } from "react";
import { Shield, Trash2, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { handleChangePassword, handleDeleteAccount } from "@/lib/actions/auth-actions";
import { useAuth } from "@/context/authContext";

export default function AccountSettings() {
    const { logout } = useAuth();

    // Change password state
    const [currentPassword, setCurrentPassword]     = useState("");
    const [newPassword, setNewPassword]             = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrent, setShowCurrent]             = useState(false);
    const [showNew, setShowNew]                     = useState(false);
    const [showConfirm, setShowConfirm]             = useState(false);
    const [passwordLoading, setPasswordLoading]     = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading]         = useState(false);
    const [deleteInput, setDeleteInput]             = useState("");

    const handlePasswordSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        try {
            setPasswordLoading(true);
            const result = await handleChangePassword(currentPassword, newPassword, confirmNewPassword);
            if (result.success) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                toast.error(result.message || "Failed to change password");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteInput !== "DELETE") {
            toast.error('Please type "DELETE" to confirm');
            return;
        }
        try {
            setDeleteLoading(true);
            const result = await handleDeleteAccount();
            if (result.success) {
                toast.success("Account deleted");
                await logout();
            } else {
                toast.error(result.message || "Failed to delete account");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#EE7A40]" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Change Password</h2>
                        <p className="text-xs text-gray-400">Update your password to keep your account secure</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Current Password */}
                    <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••"
                                className="h-11 rounded-xl border-gray-200 pr-10 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••"
                                className="h-11 rounded-xl border-gray-200 pr-10 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="••••••"
                                className="h-11 rounded-xl border-gray-200 pr-10 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-1">
                        <button
                            onClick={handlePasswordSubmit}
                            disabled={passwordLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] hover:brightness-105 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-[0_4px_14px_rgba(238,122,64,0.35)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {passwordLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Delete Account</h2>
                        <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-4 flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-6 py-3 rounded-xl border border-red-200 transition-colors duration-200"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete My Account
                    </button>
                ) : (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <p className="text-sm font-semibold text-red-700">This action is irreversible!</p>
                        </div>
                        <p className="text-xs text-red-500 mb-3">
                            Type <span className="font-bold">DELETE</span> to confirm.
                        </p>
                        <Input
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="h-10 rounded-xl border-red-200 bg-white text-sm mb-3"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading || deleteInput !== "DELETE"}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : "Confirm Delete"}
                            </button>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}