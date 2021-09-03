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
      setAward({ infoTitle: '矿石不足', infoContent: '' });
      setAlert(true);
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
      <div className="lottery-box">
        <div className="lottery">
          <img alt="" src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/background.f2441ca.png"></img>
          <div className="header">
            <img alt="" src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/title.b704296.png"></img>
            <p className="words">Switch、乐高积木及掘金周边等你来拿</p>
          </div>
          <div className="main">
            <p className="title">幸运抽奖</p>
            <div className="box">
              <div className="left-box">
                <div className="header">
                  <p className="value">当前矿石数：<span style={{ color: '#fadd95' }}>{currentStones === -1 ? stones.init : currentStones}</span></p>
                  <p className="signin">已签到</p>
                </div>
                <div className="awards-box">
                  <div className="container">
                    <AwardList items={awards} currentIndex={currentIndex}></AwardList>
                    <button id="lottery-btn" onClick={handleClick}>
                      <p>抽奖</p>
                      <p>{stones.spend}矿石/次</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="right-box">
                <p>中奖列表</p>
                <div className="results-box">
                  <ResultList items={result}></ResultList>
                </div>
              </div>
              <InfoBox award={award} alert={alert} setAlert={setAlert}></InfoBox>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <h2>loading...</h2>
    )
  }
}