import {Link, useParams} from "react-router-dom";
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
                <div className="text-muted small">
                    Posted by{" "}
                    {post.user?.username ? (
                        <Link to={`/user/${post.user.id}/posts`} className="text-muted">
                            {post.user.username}
                        </Link>
                    ) : (
                        "deleted_user"
                    )}
                    /
                    <Link to={`/groups/${post.group.id}`} className="text-muted">
                        {post.group.name}&nbsp;
                    </Link>
                    • {new Date(post.created_at).toLocaleString()}
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