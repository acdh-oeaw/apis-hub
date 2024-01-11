import type { Config } from 'tailwindcss'
import headlessUiPlugin from '@headlessui/tailwindcss'

const config = {
	content: ["./src/**/*.tsx"],
	plugins: [headlessUiPlugin],
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				"primary-light": "var(--color-primary-light)",
				"primary-dark": "var(--color-primary-dark)",
				secondary: "var(--color-secondary)",
				"secondary-light": "var(--color-secondary-light)",
				"secondary-dark": "var(--color-secondary-dark)",
				tertiary: "var(--color-tertiary)",
				"tertiary-light": "var(--color-tertiary-light)",
				"tertiary-dark": "var(--color-tertiary-dark)",
			},
			zIndex: {
				dialog: "var(--z-dialog)",
			},
		},
	},
} satisfies Config

export default config;
