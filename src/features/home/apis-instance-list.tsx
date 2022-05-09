import { useApis } from '@/features/apis/apis.context'
import { ApisInstance } from '@/features/home/apis-instance'
import styles from '@/features/home/apis-instance-list.module.css'

export function ApisInstanceList(): JSX.Element {
  const { config } = useApis()
  const { instances } = config

  return (
    <ul className={styles['container']} role="list">
      {Object.values(instances).map((instance) => {
        return (
          <li key={instance.id}>
            <ApisInstance instance={instance} />
          </li>
        )
      })}
    </ul>
  )
}
