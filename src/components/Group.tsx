import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";

interface PostData {
    id: number;
    title: string;
    body: string;
    created_at: string;
    user?: { username: string };
}

export default function Group() {
    const { id } = useParams();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');

    useEffect(() => {
        api.get(`/groups/${id}`).then(res => {
            setGroupName(res.data.name);
            setGroupDesc(res.data.desc);
        });

        api.get(`/posts/group/${id}`).then(res => {
            setPosts(res.data);
        });
    }, [id]);

    useEffect(() => {
        document.title = groupName;
    }, [groupName]);

    return (
        <div className="container mt-4">
            <h2 className="mb-2">{groupName}</h2>
            <h6 className="mb-4 text-muted">{groupDesc}</h6>
            {posts.length > 0 ? (
                posts.map(post => (
                    <PostCard id={post.id} key={post.id} title={post.title} body={post.body} created_at={post.created_at} user={post.user?.username || "deleted_user"} group={groupName} />
                ))
            ) : (
                <p className="text-muted">No posts in this group yet.</p>
            )}
        </div>
    );
}
