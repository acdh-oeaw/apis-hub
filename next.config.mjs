/** @typedef {import('next').NextConfig} NextConfig */

import createBundleAnalyzer from "@next/bundle-analyzer";
import { log } from "@stefanprobst/log";

const isCrawlerAllowed = process.env["NEXT_PUBLIC_BOTS"] === "enabled";

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: ["."],
		ignoreDuringBuilds: true,
	},
	experimental: {
		appDir: false,
	},
	async headers() {
		const headers = [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
				],
			},
			{
				source: "/assets/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, immutable, max-age=31536000",
					},
				],
			},
		];

		if (!isCrawlerAllowed) {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});

			log.warn("Indexing by search engines is disallowed.");
		}

		return headers;
	},
	images: {
		deviceSizes: [420, 620, 820],
	},
	output: "standalone",
	pageExtensions: ["api.ts", "page.tsx"],
	poweredByHeader: false,
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

/** Array<(config: NextConfig) => NextConfig> */
const plugins = [createBundleAnalyzer({ enabled: process.env["BUNDLE_ANALYZER"] === "enabled" })];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
