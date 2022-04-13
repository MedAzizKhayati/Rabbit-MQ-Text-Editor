import { useState } from 'react';
import AMQPTextArea from './AMQPTextArea';
import './home.css';
import UsernameForm from './UsernameForm';

const Home = () => {
    const [username, setUsername] = useState('');
    const [submitted, setSubmitted] = useState(false);
    return (
        <div className="home">
            <h1>Welcome To Rabbit MQ Text Editor!</h1>
            {
                !submitted ?
                    <UsernameForm {...{ username, setUsername, setSubmitted }} />
                    :
                    <>
                        <AMQPTextArea username={username} defaultContent="Hello there, this is the first section..." section="section1" />
                        <AMQPTextArea username={username} defaultContent="Hello there, this is the second section..." section="section2" />
                    </>
            }
        </div>
    );
}
export default Home;