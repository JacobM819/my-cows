import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import 'notifyjs-browser'
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
        try {

            const res1 = await fetch("https://my-cows-726n.onrender.com/score/1");
            const data1 = await res1.json();
            console.log(data1);
            newScore1(data1.score);

            const res2 = await fetch("https://my-cows-726n.onrender.com/score/2");
            const data2 = await res2.json();
            newScore2(data2.score);
        } catch (error) {
            $.notify("There was an error fetching the scores :(", "error")
            console.log(error);
        }

    }

    function addCow(player) {
        if (player === 1) {
            newScore1(score1 + 1);
            updateScore(currentPlayer, score1 + 1, 'add cow');
        } else if (player === 2) {
            newScore2(score2 + 1)
            updateScore(currentPlayer, score2 + 1, 'add cow');
        }
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
            fetch("https://my-cows-726n.onrender.com/latest-event")
                .then((res) => res.json())
                .then((data) => setEvent(data.event))
                .catch((err) => console.error("Failed to fetch event:", err));
        }, []);

        if (!event) return undefined;
        return (event);
    }

    const updateScore = async (player, score, action) => {
        try {
            console.log("Update score:", player, score, action);
            await fetch("https://my-cows-726n.onrender.com/score", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({player, score, action})
            })
            $.notify("Score updated successfully!", "success");
        } catch (error) {
            $.notify("There was en error updating the score", "error");
            console.log(error);
        }
    }

    function changeCurrentPlayer(playerNum) {
        setCurrentPlayer(playerNum);
        if (playerNum === 1) {
            document.getElementById("box-2").classList.add("hide-box");
            document.getElementById("box-1").classList.remove("hide-box");
        } else {
            document.getElementById("box-1").classList.add("hide-box");
            document.getElementById("box-2").classList.remove("hide-box");
        }
        document.getElementById("hide-select").style.visibility = "hidden";
        console.log(currentPlayer);
        return null;
    }

    return (
        <header className={'d-flex justify-content-center align-items-center'} style={{ height: '100vh' }}>
            <div className={'container'}>
                <div className={'row mb-3'}>
                    <div id={'hide-select'} className={'col text-center'}>
                        <h2>Select a player!</h2>
                    </div>
                </div>
            <div className={'row mb-5'}>
                    <div className={'col text-center'} onClick={()=>changeCurrentPlayer(1)}>
                        <div id={"box-1"} className={"hide-box selected"}>
                            <h1 className={'name'}>Jacob</h1>
                            <h1>{score1}</h1>
                        </div>
                    </div>
                    <div className={'col text-center'} onClick={()=>changeCurrentPlayer(2)}>
                        <div id={"box-2"} className={'hide-box selected'}>
                        <h1 className={'name'} >Trysta</h1>
                        <h1>{score2}</h1>
                        </div>
                    </div>
                </div>
                <div className={'row g-0'}>
                    <div className="text-center mb-4">
                        <Button
                            onClick={() => addCow(currentPlayer)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                        >
                            <img src={`${process.env.PUBLIC_URL}/images/cow-icon.png`} alt="Add Cow" style={{ width: '80px' }} />
                        </Button>
                    </div>
                    <div className={'text-center mb-4'}>
                        <Button
                            onClick={() => ripCow(currentPlayer)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                        >
                            <img src={`${process.env.PUBLIC_URL}/images/rip-icon.png`} alt="Kill Cow" style={{ width: '80px' }} />
                        </Button>
                    </div>
                    <div className={'text-center mb-4'}>
                        <Button
                            onClick={() => addCow(currentPlayer)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                        >
                            <img src={`${process.env.PUBLIC_URL}/images/revive-icon.png`} alt="Revive Cow" style={{ width: '70px' }} />
                        </Button>
                    </div>
                    <div className={'text-center mb-4'}>
                        <Button
                            onClick={() => performMiracle(currentPlayer)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                        >
                            <img src={`${process.env.PUBLIC_URL}/images/miracle-icon.png`} alt="Perform Miracle" style={{ width: '80px' }} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
  );
}
export default App;
