import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api.ts";

export default function CreatePost() {
    const [searchParams] = useSearchParams();
    const post_id = searchParams.get('post_id');
    const preselectedGroupId = searchParams.get("group_id");

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [groupId, setGroupId] = useState("");
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/groups/my-groups").then(res => {
            setGroups(res.data);
        });

        if (post_id) {
            api.get(`/posts/${post_id}`).then(res => {
                setTitle(res.data.title);
                setBody(res.data.body);
                setGroupId(res.data.group.id.toString());
            });
        } else if (preselectedGroupId) {
            setGroupId(preselectedGroupId);
        }

        if(post_id){
            document.title = "Edit Post";
        } else {
            document.title = "Create Post";
        }
    }, [post_id, preselectedGroupId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (post_id) {
                await api.patch(`/posts/${post_id}`, { title, body, group_id: Number(groupId) });
                alert("Post updated!");
            } else {
                await api.post("/posts", { title, body, group_id: groupId });
                alert("Post created!");
            }
            console.log("Submitting post:", { title, body, group_id: groupId, post_id });
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Failed to save post.");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="container mt-4">
                <h2>{post_id ? "Edit Post" : "Create Post"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Body</label>
                        <textarea className="form-control" value={body} onChange={e => setBody(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Select Group</label>
                        <select className="form-select" value={groupId} onChange={(e) => setGroupId(e.target.value)} required disabled={!!preselectedGroupId || !!post_id}>
                            {!post_id && !preselectedGroupId && <option value="" disabled>Select a group</option>}
                            {groups.map((group: any) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">{post_id ? "Update" : "Post"}</button>
                </form>
            </div>
        </div>
    );
}
