import { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../socket-api";

const AMQPTextArea = ({ defaultContent, section, username }) => {
    const [content, setContent] = useState(defaultContent);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        API.initialize(username);
        API.subscribe(onContentChange, onStateChange, section);
    }, [])

    const onContentChange = (newContent) => {
        setContent(newContent);
    }
    const onStateChange = (newState) => {
        setIsBusy(newState);
    }

    const onTextChange = (event) => {
        let newContent = event.target.value;
        setContent(newContent);
        axios.post(`${API.API_URL}/api/write`, {
            user: API.user,
            section,
            content: newContent,
        })
            .then(() => console.log("Content sent"))
            .catch(err => console.error(err));
    }

    const onFocusHandler = () => {
        axios.post(`${API.API_URL}/api/write`, {
            user: API.user,
            section,
            content: content,
        })
            .then(() => console.log("Focus sent"))
            .catch(err => console.error(err));
    }

    const onBlurHandler = () => {
        axios.post(`${API.API_URL}/api/free`, {
            section
        })
            .then(() => console.log("Free sent"))
            .catch(err => console.error(err));
    }

    return (
        <div className="section-area">
            <textarea
                onChange={onTextChange}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                style={{
                    opacity: !isBusy || isBusy === API.user ? "100%" : "40%",
                }}
                disabled={isBusy && isBusy !== API.user}

                value={content}
            />
            {
                isBusy && isBusy !== API.user &&  
                <p>{isBusy} is editing this section...</p>
            }
           
        </div>
    );
}

export default AMQPTextArea;