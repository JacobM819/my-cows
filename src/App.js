import Button from 'react-bootstrap/Button'

import { useState } from 'react';
import './App.css';

function App() {

    const [score1, newScore1] = useState(0);
    const [score2, newScore2] = useState(0);

    function createLog(name, operation, new_score) {
        return undefined
    }

    function addCow(player) {
        if (player === 1) {
            newScore1(score1+1);
        } else if (player === 2) {
            newScore2(score2+2)
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
