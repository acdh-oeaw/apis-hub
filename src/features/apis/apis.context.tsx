import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import type { ApisInstanceConfig, UserAuth } from "~/config/apis.config";
import { config } from "~/config/apis.config";

interface ApisConfig {
	instances: Record<ApisInstanceConfig["id"], ApisInstanceConfig>;
}

const initialState: ApisConfig = config;

interface ApisContextValue {
	config: ApisConfig;
	addInstance: (instance: ApisInstanceConfig) => void;
	signIn: (instance: ApisInstanceConfig, user: UserAuth) => void;
}

const ApisContext = createContext<ApisContextValue | null>(null);

interface ApisProviderProps {
	children: ReactNode;
}

export function ApisProvider(props: ApisProviderProps): JSX.Element {
	const { children } = props;

	const [config, setConfig] = useState(initialState);

	const value: ApisContextValue = useMemo(() => {
		function addInstance(instance: ApisInstanceConfig) {
			setConfig((config) => {
				const currentInstances = config.instances;
				const updatedInstances = { ...currentInstances, [instance.id]: instance };

				return { ...config, instances: updatedInstances };
			});
		}

		function signIn(instance: ApisInstanceConfig, user: UserAuth) {
			addInstance({ ...instance, access: { type: "restricted", user } });
		}

		return {
			addInstance,
			config,
			signIn,
		};
	}, [config]);

	return <ApisContext.Provider value={value}>{children}</ApisContext.Provider>;
}

export function useApis(): ApisContextValue {
	const value = useContext(ApisContext);

	if (value == null) {
		throw new Error("`useApis` must be used within an `ApisProvider`.");
	}

	return value;
}
