import { z } from "zod";

const schema = z.object({
	NEXT_PUBLIC_BASE_URL: z.string(),
	NEXT_PUBLIC_BOTS: z.literal("enabled").optional(),
	NEXT_PUBLIC_MATOMO_BASE_URL: z.string().optional(),
	NEXT_PUBLIC_MATOMO_ID: z.string().optional(),
	NEXT_PUBLIC_REDMINE_ID: z.string(),
});

const result = schema.safeParse(process.env);

if (!result.success) {
	const errors = result.error.flatten().fieldErrors;
	const message = ["Missing environment variables.\n", JSON.stringify(errors)].join("\n");
	throw new Error(message);
}

export const env = result.data;
