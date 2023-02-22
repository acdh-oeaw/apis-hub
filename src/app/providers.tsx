import { HttpError } from "@stefanprobst/request";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { useState } from "react";

import { ApisProvider } from "@/features/apis/apis.context";
import { GraphsProvider } from "@/features/networks/graphs.context";
import { toast } from "@/features/toast/toast";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers(props: ProvidersProps): JSX.Element {
	const { children } = props;

	const [client] = useState(createQueryClient);

	return (
		<ApisProvider>
			<GraphsProvider>
				<QueryClientProvider client={client}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
			</GraphsProvider>
		</ApisProvider>
	);
}

function createQueryClient(): QueryClient {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
				staleTime: Infinity,
				onError(error) {
					const message = error instanceof HttpError ? error.response.statusText : String(error);
					toast.error(message);
				},
			},
		},
	});

	return client;
}
