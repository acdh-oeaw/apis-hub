import cx from "clsx";
import Image from "next/image";
import Link from "next/link";

import type { ApisInstanceConfig } from "~/config/apis.config";

interface ApisInstanceProps {
	index: number;
	instance: ApisInstanceConfig;
}

export function ApisInstance(props: ApisInstanceProps): JSX.Element {
	const { index, instance } = props;

	const hasImage = instance.image.length > 0;

	return (
		<article className="grid grid-rows-[256px_auto] overflow-hidden rounded shadow-md">
			<div
				className={cx(
					"relative border",
					!hasImage && "bg-gradient-to-br from-secondary-light to-primary",
				)}
			>
				{hasImage ? (
					instance.image.startsWith("/assets/images") ? (
						<Image
							alt=""
							className="absolute inset-0 size-full object-cover"
							fill
							/** Preload first three images. */
							priority={index < 3}
							sizes="(max-width: 480px) 420px, 820px"
							src={instance.image}
						/>
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img alt="" className="absolute inset-0 size-full object-cover" src={instance.image} />
					)
				) : null}
			</div>
			<div className="grid gap-8 p-8 ">
				<header className="grid gap-4">
					<h2 className="text-2xl">
						<Link href={{ pathname: `/networks/${instance.id}` }}>{instance.title}</Link>
					</h2>
					<h3 className="text-lg">{instance.subtitle}</h3>
				</header>
				<p className="line-clamp-[8]">{instance.description}</p>
				<footer className="flex items-center justify-between">
					<a
						aria-label={`More info on ${instance.title}`}
						className="hover:underline"
						href={instance.url}
						rel="noreferrer"
						target="_blank"
					>
						More info
					</a>
					<Link
						aria-label={`Explore ${instance.title} dataset`}
						className="rounded bg-primary px-6 py-2 font-semibold text-white transition hover:bg-primary-dark"
						href={{ pathname: `/networks/${instance.id}` }}
					>
						Explore dataset
					</Link>
				</footer>
			</div>
		</article>
	);
}
