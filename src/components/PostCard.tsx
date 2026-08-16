import * as React from "react";
import {Link} from "react-router-dom";
import "../css/Post.css";

interface PostCardProps {
    id: number;
    title: string;
    body: string;
    user: string | null;
    group: string;
    created_at: string;
    image?: string | null;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, body, user, group, image }) => {
    return (
        <Link to={`/posts/${id}`} className="text-decoration-none text-reset">
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <small className="text-muted">{user || 'deleted_user'}/{group}</small>
                    <h5 className="card-title mt-2">{title}</h5>
                    <p className="card-text">{body}</p>
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="post-thumbnail"
                        />
                    )}
                    <div className="d-flex">
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard;