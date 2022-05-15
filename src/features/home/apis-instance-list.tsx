import { useApis } from '@/features/apis/apis.context'
import { ApisInstance } from '@/features/home/apis-instance'
import styles from '@/features/home/apis-instance-list.module.css'

export function ApisInstanceList(): JSX.Element {
  const { config } = useApis()
  const { instances } = config

  return (
    <ul className={styles['container']} role="list">
      {Object.values(instances).map((instance, index) => {
        return (
          <li key={instance.id}>
            <ApisInstance index={index} instance={instance} />
          </li>
        )
      })}
    </ul>
  )
}
