
interface Props {
	name: string,
	measure: number
}

const Stat = ({ name, measure }: Props) => {
	return (
		<div>
			<div>{name}</div>
			<h1>{measure}%</h1>
		</div>
	)
}

export default Stat