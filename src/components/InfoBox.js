export default function InfoBox(props) {
  const { award, alert, setAlert } = props;
  if (alert) return (
    <div className="info-box">
      <div className="header">
        <span>{award.title}</span>
      </div>
      <div className="main">
        <div className="box">
          <img alt="award-img" src={award.img}></img>
          <p className="title">{award.content}</p>
          <p className="content">{award.desc}</p>
          <button onClick={() => { setAlert(false) }}>我知道了</button>
        </div>
      </div>
    </div>
  )
  else return (
    <></>
  )
}