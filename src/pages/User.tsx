import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import '../css/Form.css';
import '../css/User.css'
import * as React from "react";
import defaultAvatar from '../assets/student.png';

export default function User() {
    const { user, logout, refreshUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        currentPassword: "",
    });

    const [currentPassword, setCurrentPassword] = useState('');

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                password: "",
                currentPassword: "",
            });
        }

        document.title = 'User';
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            email: formData.email,
            current_password: currentPassword,
        };

        if (formData.password.trim() !== "") {
            payload.password = formData.password;
        }

        try {
            await api.patch(`/users/me`, payload);
            alert("User updated successfully.");
            setEditMode(false);
            setFormData(prev => ({ ...prev, password: "" }));
        } catch (err: any) {
            console.error(err);
            alert("Failed to update user.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) {
            return;
        }

        try {
            await api.delete('/users/me');
            alert('Your account has been deleted.');
            logout();
        } catch (err: any) {
            console.error(err);
            alert("Failed to delete account.");
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile || !currentPassword) {
            alert("Please choose an image.");
            return;
        }

        if (!currentPassword) {
            alert("Please enter your current password");
            return;
        }

        try {
            setUploadingAvatar(true);

            const presignResponse = await api.post('/uploads/presign', {
                filename: avatarFile.name,
                contentType: avatarFile.type,
            });

            const { uploadUrl, publicUrl } = presignResponse.data;

            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": avatarFile.type },
                body: avatarFile,
            });

            if (!uploadResponse.ok) {
                throw new Error("S3 upload failed");
            }

            await api.patch('/users/me/avatar', {
                avatar: publicUrl,
                current_password: currentPassword,
            });

            await refreshUser();

            setAvatarFile(null);
            setCurrentPassword("");

            alert("Avatar updated successfully.");
        } catch (err: any) {
            console.error(err);

            alert(
                err.response?.data?.message || "Failed to update avatar."
            );
        } finally {
            setUploadingAvatar(false);
            setEditMode(false);
        }
    };

    return (
        <div className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h3 className="mb-3 fw-heavy text-center">{ editMode ? <>Edit Profile</> : <>Your Profile</> }</h3>

                <div className="text-center mb-3">
                    <img
                        src={user?.avatar || defaultAvatar}
                        alt={"Profile picture"}
                        className="avatar"
                    />
                </div>

                {editMode && (
                    <div className="mb-3">
                        <label className="form-label">
                            Change profile picture
                        </label>

                        <input
                            type="file"
                            className="form-control mb-2"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    setAvatarFile(file);
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={handleAvatarUpload}
                            disabled={!avatarFile || !currentPassword || uploadingAvatar}
                        >
                            {uploadingAvatar
                                ? 'Uploading...'
                                : 'Update Profile Picture'}
                        </button>
                    </div>
                )}

                <div className="form-floating mb-2">
                    <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} disabled={!editMode}/>
                    <label>First Name</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} disabled={!editMode}/>
                    <label>Last Name</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} disabled={!editMode}/>
                    <label>Username</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} disabled={!editMode}/>
                    <label>Email</label>
                </div>

                {editMode && (
                    <>
                        <div className="form-floating mb-2">
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange}/>
                            <label>New Password</label>
                        </div>

                        <div className="form-floating mb-2">
                            <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                            <label htmlFor="currentPassword">Current Password</label>
                        </div>
                    </>
                )}

                {editMode ? (
                    <>
                        <button type="submit" className="btn btn-primary w-100 py-2 mb-2">Save Changes</button>

                        <button type="button" onClick={() => setEditMode(false) } className="btn btn-outline-primary w-100 py-2">Cancel</button>
                    </>
                ) : (
                    <>
                        <button type="button" onClick={() => setEditMode(true)} className="btn btn-primary w-100 py-2 mb-2">Update Info</button>

                        <button type="button" onClick={handleDelete} className="btn btn-danger w-100 py-2">Delete account</button>
                    </>
                )}
            </form>
        </div>
    );
}