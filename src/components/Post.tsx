import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/api.ts";

export default function Post() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        api.get(`/posts/${id}`).then(res => setPost(res.data));
        api.get(`/comments/post/${id}`).then(res => setComments(res.data));


    }, [id]);

    useEffect(() => {
        if(post){
            document.title = post.title;
        }
    }, [post]);

    if (!post) return <div className="text-center mt-4">Loading...</div>;

    return (
        <>
            <div className="container mt-4">
                <div>
                    <div className="text-muted small">Posted by {post.user?.username || "deleted_user"}/{post.group?.name || "unknown"} • {new Date(post.created_at).toLocaleString()}</div>
                    <h2 className="mt-2">{post.title}</h2>
                    <p>{post.body}</p>
                </div>

                <h4>Comments</h4>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div className="card mb-2" key={comment.id}>
                            <div className="card-body">
                                <div className="text-muted small">{comment.user?.username || "deleted_user"} • {new Date(comment.created_at).toLocaleString()}</div>
                                <p className="card-text mt-2">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No comments yet.</p>
                )}
            </div>
        </>
    )
}