import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate();

   useEffect(() => {
        async function getData() {
            const resp = await fetch(props.deploy + 'profile', {
                credentials: 'include',
            });

            if (!resp.error)
                setUserInfo(resp);
        }
        getData();

    }, []);

    function logout() {
        fetch(props.deploy+'logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        navigate('/');
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
