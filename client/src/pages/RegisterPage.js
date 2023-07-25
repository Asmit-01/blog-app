import { useState } from "react";
import {useNavigate} from "react-router-dom"

export default function RegisterPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function register(ev) {
        ev.preventDefault();
        if (username == null || password == null) {
            alert('Invalid input')
            navigate('/register')
            return;
        }
        const response = await fetch(props.deploy + 'register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 200) {
            alert('registration successful');
        } else {
            alert('registration failed');
        }
    }
    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
            <input type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            <button>Register</button>
        </form>
    );
}
