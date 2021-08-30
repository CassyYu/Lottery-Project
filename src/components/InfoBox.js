export default function InfoBox(props) {
  const { award, alert, setAlert } = props;
  if (alert) return (
    <div className="info-box">
      <div className="header">
        <h2>友情提示</h2>
      </div>
      <div className="main">
        <p>{award.infoTitle}</p>
        <p>{award.infoContent}</p>
        <button onClick={() => { setAlert(false) }}>我知道了</button>
      </div>
    </div>
  )
  else return (
    <></>
  )
}