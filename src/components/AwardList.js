export default function AwardList(props) {
  const { items, currentIndex } = props;
  return items.map((item, index) =>
    <button className={index === currentIndex ? "award-btn"+index+" active-btn" : "award-btn"+index} key={index}>
      <img src={item.img} alt="award"></img>
      <p>{item.name}</p>
    </button>
  )
}