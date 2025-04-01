import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.ts";

export default function CreateGroup() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/groups", { name, desc });

            alert("Group created successfully!");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Failed to create group.");
        }
    };

    useEffect(() => {
        document.title = "Create Group";
    })

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="container mt-4">
                <h2>Create Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Group Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" value={desc} onChange={(e) => setDesc(e.target.value)} required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Group</button>
                </form>
            </div>
        </div>
    );
}