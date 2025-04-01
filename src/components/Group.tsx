import {Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";
import {useAuth} from "../context/AuthContext.tsx";

interface PostData {
    id: number;
    title: string;
    body: string;
    created_at: string;
    user?: { username: string };
}

export default function Group() {
    const { id } = useParams();
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        api.get(`/groups/${id}`).then(res => {
            setGroupName(res.data.name);
            setGroupDesc(res.data.desc);
        });

        api.get(`/posts/group/${id}`).then(res => {
            setPosts(res.data);
        });

        api.get(`/user-groups/is-member/${id}`).then(res => {
            setIsMember(res.data.isMember);
        });
    }, [id, refresh]);

    const handleToggleMembership = async () => {
        try {
            if(isMember) {
                await api.delete(`/user-groups/leave/${id}`);
            } else {
                await api.post(`/user-groups/join/${id}`);
            }
            setRefresh(prev => !prev);

        } catch (err) {
            console.error('Failed to update group membership', err);
            alert('Something went wrong!');
        }
    }

    useEffect(() => {
        document.title = groupName;
    }, [groupName]);

    return (
        <div className="d-flex justify-content-center">
            <div className="container mt-4">
                <div className="d-flex gap-2 align-items-stretch mb-4">
                    {isLoggedIn && (
                        <button className={`btn ${isMember ? 'btn-outline-danger' : 'btn-outline-success'} w-auto`} onClick={handleToggleMembership}>{isMember ? 'Leave Group' : 'Join Group'}</button>
                    )}

                    {isMember && (
                        <Link to={`/create?group_id=${id}`} className="btn btn-primary w-auto d-flex align-items-center justify-content-center">Create Post</Link>
                    )}
                </div>

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
        </div>
    );
}
