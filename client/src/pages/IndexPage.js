import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage(props) {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(props.deploy + 'post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <>
            {posts.length > 0 && posts.map((post,idx) => (
                <Post {...post} key={idx}/>
            ))}
        </>
    );
}
