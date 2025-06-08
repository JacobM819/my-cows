import './App.css';
import { useEffect } from 'react';

function Loading() {
    useEffect(() => {
        waitForAwake();
    }, []);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkAwake() {
        try {
            const res = await fetch("https://my-cows-726n.onrender.com/health");
            const data = await res.json();
            console.log(data);
            return res.status; // This is the HTTP status (e.g., 200 or 500)
        } catch (error) {
            console.log("Health check failed:", error);
            return null; // Treat error as not awake
        }
    }

    async function waitForAwake() {
        let status = null;

        while (status !== 200) {
            status = await checkAwake();
            if (status !== 200) {
                console.log("Still sleeping, retrying in 2s...");
                await sleep(2000); // Wait 2 seconds before next attempt
            }
        }
        console.log("Render is awake!");
        document.getElementById("loading")?.remove();
    }

    return (
            <div id={'loading'} style={overlayStyle}>
                <h1>Loading...</h1>
            </div>
        );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgb(229,190,167)', // semi-transparent black
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

export default Loading;