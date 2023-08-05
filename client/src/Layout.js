import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
    return (
        <main>
            <Header props={props} />
            <Outlet props={props} />
        </main>
    );
}
