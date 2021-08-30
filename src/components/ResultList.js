export default function ResultList(props) {
  const { items } = props;
  if (items.length) return (
    items.map((item, index) =>
      <p key={index}>{item}</p>
    )
  )
  else return (
    <p>还没有中奖奖品</p>
  )
}