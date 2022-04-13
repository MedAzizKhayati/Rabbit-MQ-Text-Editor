const UsernameForm = ({ setSubmitted, username, setUsername }) => {

    const handleSubmit = event => {
        event.preventDefault();
        setSubmitted(true);
    }

    const handleChange = event => {
        setUsername(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <label>Username:</label>
            <input
                type="text"
                name="username"
                placeholder="Enter your username..." 
                autoComplete="off"
            />
            <input
                disabled={!username}
                onChange={handleSubmit}
                type="submit"
                className={username ? "enabled" : "disabled"}
            />
        </form>
    );
}
export default UsernameForm;