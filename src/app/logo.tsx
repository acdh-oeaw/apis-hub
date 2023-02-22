import { range } from "@stefanprobst/range";
import type { CSSProperties } from "react";

import styles from "@/app/logo.module.css";

export function Logo(): JSX.Element {
	return (
		<div aria-hidden className={styles["container"]}>
			<Hexagon color="var(--color-primary)" />
			<Hexagon color="var(--color-secondary)" />
			<Hexagon color="var(--color-tertiary)" />
		</div>
	);
}

interface HexagonProps {
	color: CSSProperties["color"];
}

function Hexagon(props: HexagonProps): JSX.Element {
	const { color } = props;

	const radius = 16;
	const diameter = radius * 2;

	return (
		<svg className={styles["hexagon"]} viewBox={`0 0 ${diameter} ${diameter}`}>
			<polygon fill={color} points={createPoints(radius)} />
		</svg>
	);
}

const piThird = Math.PI / 3;

function createPoints(radius: number) {
	const points: Array<[number, number]> = [];

	range(0, 5).forEach((index) => {
		const theta = index * piThird;
		const x = radius + radius * Math.sin(theta);
		const y = radius + radius * Math.cos(theta);
		points.push([x, y]);
	});

	return points
		.map((point) => {
			return point
				.map((coordinate) => {
					/** Round to avoid hydration mismatches. */
					return coordinate.toFixed(2);
				})
				.join(",");
		})
		.join(" ");
}
