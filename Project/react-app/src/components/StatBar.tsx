import { useEffect, useRef } from "react";
import Stat from "./Stat"

interface Props {
	target: number,
	actual: number,
}

const StatBar = ({target, actual}: Props) => {

	const separatorRef = useRef<HTMLDivElement>(null); // Explicitly define the type of separatorRef

    useEffect(() => {
			if (separatorRef.current) {
				const parentHeight = separatorRef.current.parentElement?.clientHeight; // Use optional chaining to safely access parentElement
				if (parentHeight) {
						separatorRef.current.style.height = `${parentHeight * 0.4}px`;
				}
		}
    }, []);

	return (
		<div className="statBar">
			<Stat name="Target" measure={target}/>
			<div ref={separatorRef} className="seperator"></div>
			<Stat name="Actual" measure={actual}/>
		</div>
	)
}

export default StatBar