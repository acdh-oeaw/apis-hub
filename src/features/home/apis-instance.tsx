import cx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/features/home/apis-instance.module.css'
import type { ApisInstanceConfig } from '~/config/apis.config'

interface ApisInstanceProps {
  index: number
  instance: ApisInstanceConfig
}

export function ApisInstance(props: ApisInstanceProps): JSX.Element {
  const { index, instance } = props

  const hasImage = instance.image.length > 0

  return (
    <article className={styles['container']}>
      <div
        className={cx(
          'relative border',
          !hasImage && 'bg-gradient-to-br from-secondary-light to-primary',
        )}
      >
        {hasImage ? (
          instance.image.startsWith('/assets/images') ? (
            <Image
              alt=""
              layout="fill"
              objectFit="cover"
              /** Preload first three images. */
              priority={index < 3}
              sizes="(max-width: 480px) 420px, 820px"
              src={instance.image}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="inset-o absolute h-full w-full object-cover"
              src={instance.image}
            />
          )
        ) : null}
      </div>
      <div className={styles['content']}>
        <header>
          <h2>
            <Link href={{ pathname: `/networks/${instance.id}` }}>{instance.title}</Link>
          </h2>
          <h3>{instance.subtitle}</h3>
        </header>
        <p>{instance.description}</p>
        <footer>
          <a
            aria-label={`More infon on ${instance.title}`}
            className={styles['link']}
            href={instance.url}
            rel="noreferrer"
            target="_blank"
          >
            More info
          </a>
          <Link
            aria-label={`Explore ${instance.title} dataset`}
            className={styles['link-button']}
            href={{ pathname: `/networks/${instance.id}` }}
          >
            Explore dataset
          </Link>
        </footer>
      </div>
    </article>
  )
}
