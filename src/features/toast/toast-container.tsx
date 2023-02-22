import "react-toastify/dist/ReactToastify.css";

import type { CSSProperties } from "react";
import { ToastContainer as ToastifyContainer } from "react-toastify";

export function ToastContainer(): JSX.Element {
	return (
		<ToastifyContainer
			bodyClassName="text-sm font-semibold"
			position="bottom-left"
			style={
				{
					"--toastify-color-error": "var(--color-error)",
					"--toastify-color-info": "var(--color-info)",
					"--toastify-color-success": "var(--color-success)",
					"--toastify-color-warning": "var(--color-warning)",
					"--toastify-font-family": "var(--font-family-base)",
					"--toastify-toast-min-height": "3.5rem",
				} as CSSProperties
			}
			theme="colored"
		/>
	);
}
