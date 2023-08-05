import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post(props) {

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${props.post._id}`}>
                    <img src={props.post.cover.url} alt="" />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${props.post._id}`}>
                    <h2>{props.post.title}</h2>
                </Link>
                <p className="info">
                    <a className="author">{props.post.author.username}</a>
                    <time>{formatISO9075(new Date(props.post.createdAt))}</time>
                </p>
                <p className="summary">{props.post.summary}</p>
            </div>
        </div>
    );
}
