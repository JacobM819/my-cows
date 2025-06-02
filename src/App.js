import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

function App() {
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [score1, newScore1] = useState();
    const [score2, newScore2] = useState();

    useEffect(() => {
        console.log("Data fetched!");
        fetchInitialScore(2, 0, 'create');
    }, []);

    async function fetchInitialScore(player, score, action) {

        const res1 = await fetch("http://localhost:3001/score/1");
        const data1 = await res1.json();
        console.log(data1);
        newScore1(data1.score);

        const res2 = await fetch("http://localhost:3001/score/2");
        const data2 = await res2.json();
        newScore2(data2.score);

    }

    function addCow(player) {
        if (player === 1) {
            newScore1(score1+1);
            updateScore(currentPlayer, score1+1, 'add cow');
        } else if (player === 2) {
            newScore2(score2+1)
            updateScore(currentPlayer, score2+1, 'add cow');
        }
        console.log(currentPlayer)
        return null;
    }

    function ripCow(player) {
        player===1 ? newScore1(0) : newScore2(0);
        updateScore(player, 0, 'kill cows :(')
        return null;
    }
    function performMiracle(player) {

        if (player === 1) {
            newScore1(score1*2);
            updateScore(player, score1*2, 'a miracle!!')
        } else {
            newScore2(score2*2)
            updateScore(player, score2*2, 'a miracle!!')
        }
        return null;
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

        return score1;
    }

    function GetPlayerScore2() {

        useEffect(() => {
            fetch("http://localhost:3001/score/2")
                .then((res) => res.json())
                .then((data) => newScore2(data.score));
        }, []);

        return score2;
    }

    const updateScore = async (player, score, action) => {
        console.log("Update score:", player, score, action);
        await fetch("http://localhost:3001/score", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({player, score, action})
        })
    }

    function changeCurrentPlayer(playerNum) {
        setCurrentPlayer(playerNum);
        console.log(currentPlayer);
        return null;
    }

    return (
        <header className={'d-flex justify-content-center align-items-center'} style={{ height: '100vh' }}>
            <div className={'container'}>
            <div className={'row mb-5'}>
                    <div className={'col text-center'} onClick={()=>changeCurrentPlayer(1)}>
                        <h1>Jacob</h1>
                        <h3>{score1}</h3>
                    </div>
                    <div className={'col text-center'} onClick={()=>changeCurrentPlayer(2)}>
                        <h1>Trysta</h1>
                        <h3>{score2}</h3>
                    </div>
                </div>
                <div className={'row g-0'}>
                    <div className={'col-2 text-center'}>
                        <Button variant={'primary'} onClick={()=>addCow(currentPlayer)}>Cow</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>ripCow(currentPlayer)}>RIP</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>addCow()}>Revive</Button>
                    </div>
                    <div className={'col text-center'}>
                        <Button variant={'primary'} onClick={()=>performMiracle(currentPlayer)}>Miracle</Button>
                    </div>
                </div>
            </div>
        </header>
  );
}
export default App;
