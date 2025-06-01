import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

function App() {

    const [score1, newScore1] = useState();
    const [score2, newScore2] = useState();

    useEffect(() => {
        console.log("Data fetched!");
        fetchInitialScore();
    }, []);

    async function fetchInitialScore() {
        const res = await fetch("http://localhost:3001/latest-event");
        const data = await res.json();

        if (typeof data?.event?.score === "number") {
            newScore1(data.event.score);
        }
    }

    function addCow(player) {
        if (player === 1) {
            newScore1(score1+1);
            createCowEvent(player, score1+1, "claim");
        } else if (player === 2) {
            newScore2(score2+1)
        }
        return undefined;
    }

    function ripCow(player) {
        if (player === 1) {
            newScore1(0);
        } else if (player === 2) {
            newScore2(0)
        }
        return undefined;
    }
    function performMiracle(player) {
        if (player === 1) {
            newScore1(score1*2);
        } else if (player === 2) {
            newScore2(score2*2)
        }
        return undefined;
    }

    function GetLatestCowEvent() {
        const [event, setEvent] = useState(null);

        useEffect(() => {
            fetch("http://localhost:3001/latest-event")
                .then((res) => res.json())
                .then((data) => setEvent(data.event))
                .catch((err) => console.error("Failed to fetch event:", err));
        }, []);

        if (!event) return undefined;

        return (event);
    }

    function GetPlayerScore1() {
        useEffect(() => {
            fetch("http://localhost:3001/score/1")
                .then((res) => res.json())
                .then((data) => newScore1(data.score));
        }, []);
    }

    function GetPlayerScore2() {
        useEffect(() => {
            fetch("http://localhost:3001/score/2")
                .then((res) => res.json())
                .then((data) => newScore2(data.score));
        }, []);
    }

    const updateScore = async (player, score) => {
        await fetch("http://localhost:3001/log-event", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({player, score})
        })
    }

    const createCowEvent = async (player, score, action) => {
        await fetch("http://localhost:3001/log-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player, score, action }),
        });
    };

    return (
        <header className={'d-flex justify-content-center align-items-center'} style={{ height: '100vh' }}>
            <div className={'container'}>
            <div className={'row mb-5'}>
                    <div className={'col text-center'}>
                        <h1>Jacob</h1>
                        <h3>{score1}</h3>
                    </div>
                    <div className={'col text-center'}>
                        <h1>Trysta</h1>
                        <h3>{score2}</h3>
                    </div>
                </div>
                <div className={'row g-0'}>
                    <div className={'col-2 text-center'}>
                        <Button variant={'primary'} onClick={()=>addCow(1)}>Cow</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>ripCow(1)}>RIP</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>addCow()}>Revive</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>performMiracle(1)}>Miracle</Button>
                    </div>
                </div>
            </div>
        </header>
  );
}
export default App;
