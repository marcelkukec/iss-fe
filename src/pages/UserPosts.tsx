import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";

export default function UserPosts() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        api.get(`/posts/user/${id}`).then(res => {
            setPosts(res.data);
            if (res.data.length > 0) {
                setUsername(res.data[0].user.username || "deleted_user");
            } else {
                setUsername("User");
            }
        });
    }, [id]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Posts by {username}</h2>
            {posts.length > 0 ? (
                posts.map((post: any) => (
                    <PostCard key={post.id} id={post.id} title={post.title} body={post.body} created_at={post.created_at} user={post.user?.username || "deleted_user"} group={post.group?.name || "unknown"}/>
                ))
            ) : (
                <p className="text-muted">No posts from this user yet.</p>
            )}
        </div>
    );
}
