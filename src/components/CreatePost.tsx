import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState("");

    const [searchParams] = useSearchParams();
    const preselectedGroupId = searchParams.get("group_id");

    const navigate = useNavigate();

    useEffect(() => {
        api.get("/groups/my-groups").then(res => {
            setGroups(res.data);

            if (preselectedGroupId) {
                setGroupId(preselectedGroupId);
            } else {
                setGroupId("");
            }
        });
    }, [preselectedGroupId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/posts", {
                title,
                body,
                group_id: groupId,
            });

            alert("Post created successfully!");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Failed to create post.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Body</label>
                    <textarea className="form-control" rows={5} value={body} onChange={e => setBody(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Select Group</label>
                    <select className="form-select" value={groupId} onChange={(e) => setGroupId(e.target.value)} required disabled={!!preselectedGroupId}>
                        {!preselectedGroupId && <option value="" disabled>Select a group</option>}
                        {groups.map((group: any) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Post</button>
            </form>
        </div>
    );
}
