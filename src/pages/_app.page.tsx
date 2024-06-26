import "tailwindcss/tailwind.css";
import "@/styles/index.css";
import "@/styles/prose.css";

import { ErrorBoundary } from "@stefanprobst/next-error-boundary";
import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { createUrl } from "@stefanprobst/request";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { Fragment } from "react";

import { ErrorPage } from "@/app/error-page";
import { PageLayout } from "@/app/page.layout";
import { Providers } from "@/app/providers";
import { AnalyticsScript } from "@/features/analytics/analytics-script";
import { reportPageView } from "@/features/analytics/analytics-service";
import { ToastContainer } from "@/features/toast/toast-container";
import { useRoute } from "@/lib/use-route";
import { baseUrl } from "~/config/app.config";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

export default function App(props: AppProps): JSX.Element {
	const { Component, pageProps } = props;

	const route = useRoute();
	const canonicalUrl = String(createUrl({ baseUrl, pathname: route.pathname }));

	return (
		<Fragment>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/icon.svg" type="image/svg+xml" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href={"/" + manifestFileName} />
			</Head>
			<PageMetadata
				canonicalUrl={canonicalUrl}
				language={metadata.locale}
				title={metadata.title}
				description={metadata.description}
				openGraph={{
					images: [{ src: "/" + openGraphImageName, alt: "" }],
				}}
				twitter={{}}
			/>
			<AnalyticsScript />
			<ErrorBoundary fallback={<ErrorPage />}>
				<Providers>
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
					<ToastContainer />
				</Providers>
			</ErrorBoundary>
		</Fragment>
	);
}

export function reportWebVitals(metric: NextWebVitalsMetric): void {
	switch (metric.name) {
		case "Next.js-hydration":
			/** Register right after hydration. */
			break;
		case "Next.js-route-change-to-render":
			/** Register page views after client-side transitions. */
			reportPageView();
			break;
		default:
			break;
	}
}
