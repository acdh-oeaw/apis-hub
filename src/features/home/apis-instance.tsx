import Image from 'next/image'
import Link from 'next/link'

import styles from '@/features/home/apis-instance.module.css'
import type { ApisInstanceConfig } from '~/config/apis.config'

interface ApisInstanceProps {
  instance: ApisInstanceConfig
}

export function ApisInstance(props: ApisInstanceProps): JSX.Element {
  const { instance } = props

  return (
    <article className={styles['container']}>
      <div className="relative border">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          priority
          sizes="(max-width: 480px) 420px, 820px"
          src={instance.image}
        />
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
