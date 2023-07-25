import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    async function login(ev) {
        ev.preventDefault();
        if (username == null || password == null) {
            alert('Invalid input');
            navigate('/login')
            return;
        }
        const response = await fetch(props.deploy + 'login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('wrong credentials');
        }
    }

    if (redirect) {
        navigate('/')
    }
    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
            <input type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            <button>Login</button>
        </form>
    );
}
