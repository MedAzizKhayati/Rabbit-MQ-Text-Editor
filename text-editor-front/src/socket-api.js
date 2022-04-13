import clientSocket from 'socket.io-client';
import axios from "axios";

export const API_URL = "http://10.13.14.93:5555";
export let user = "";

const socket = clientSocket(`${API_URL}/text`);
export const initialize = newUser => {
    if(user || !newUser) return;
    user = newUser;
    axios.post(API_URL + "/api/register", { user })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
}

export const subscribe = (onContentChange, onStateChange, section) => {
    console.log("Subscribed");
    socket.on(`${user}/content`, (result) => {
        result = JSON.parse(result);
        if (result.section === section)
            onContentChange(result.content);
    });
    socket.on(`${user}/state`, state => {
        state = JSON.parse(state);
        if (state.section === section)
            onStateChange(state.state);
    })
}