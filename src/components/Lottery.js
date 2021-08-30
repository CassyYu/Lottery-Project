import { useEffect, useState } from 'react';
import { getData, getTargetIndex } from '../data';
import InfoBox from './InfoBox';
import AwardList from './AwardList';
import ResultList from './ResultList';

export default function Lottery() {

  const LOOP = 3;
  const AWARD_STONES = 66;

  const [stones, setStones] = useState({});
  const [award, setAward] = useState({})
  const [awards, setAwards] = useState([]);
  const [result, setResult] = useState([]);
  const [timerId, setTimerId] = useState(-1);
  const [alert, setAlert] = useState(false);
  const [targetIndex, setTargetIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentStones, setCurrentStones] = useState(-1);

  useEffect(() => {
    if (currentStones === -1) {
      (async () => {
        const res = await getData();
        const _stones = res[0].stones;
        const _awards = res[1].awards;
        setStones(_stones);
        setAwards(_awards);
        setCurrentStones(_stones.init);
      })()
    }
    (async () => {
      const res = await getTargetIndex();
      setTargetIndex(res);
    })()
  }, [currentStones, timerId]);

  const handleClick = () => {
    if (currentStones < stones.spend) {
      alert("矿石不足");
      return;
    }
    if (timerId !== -1) return;
    setCurrentStones(currentStones - stones.spend);
    new Promise((resolve) => {
      let i = currentIndex, loop = 0;
      const tId = setInterval(() => {
        if (i === 3) i += 2;
        else if (i < 8) ++i;
        else {
          i = 0;
          ++loop;
        }
        setCurrentIndex(i);
        if (i === targetIndex && loop === LOOP) {
          clearInterval(tId);
          setTimerId(-1);
          resolve();
        }
      }, 100);
      setTimerId(tId);
    }).then(() => {
      const name = awards[targetIndex].name;
      const newResult = result.map(x => x);
      newResult.push(name);
      setResult(newResult);
      setTimeout(() => {
        setAlert(true);
        setAward(awards[targetIndex]);
        if (targetIndex === 0) setCurrentStones(currentStones - stones.spend + AWARD_STONES);
      }, 700);
    }).catch((err) => {
      console.error(err);
    });
  }

  if (awards.length) {
    return (
      <div className="lottery">
        <header>
          <h1>幸运抽奖</h1>
          <h2>当前矿石数：{currentStones === -1 ? stones.init : currentStones}</h2>
        </header>
        <main>
          <div className="awards-box">
            <AwardList items={awards} currentIndex={currentIndex}></AwardList>
            <button className="lottery-btn" onClick={handleClick}>
              <p>抽奖</p>
              <p>{stones.spend}矿石/次</p>
            </button>
          </div>
          <InfoBox award={award} alert={alert} setAlert={setAlert}></InfoBox>
        </main>
        <footer>
          <div className="results-box">
            <h2>中奖列表</h2>
            <ResultList items={result}></ResultList>
          </div>
        </footer>
      </div>
    )
  } else {
    return (
      <h2>loading...</h2>
    )
  }
}