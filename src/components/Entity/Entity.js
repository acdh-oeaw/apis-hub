import React from 'react'

import Button from '../../elements/Button/Button'
// import CenterIcon from '../../elements/CenterIcon/CenterIcon'

import styles from './Entity.module.css'

import { colors } from '../../utils/api'

const Entity = ({
  centerNode,
  entity,
  graph,
  selectedNodeIds,
  setSelectedNodeIds,
}) => {
  if (!entity) return null

  return (
    <div
      className={styles.Entity}
      title={'Alternative names: ' + entity.alternativeNames.join(', ')}
    >
      <header className={styles.EntityHeader}>
        <button
          className={styles.CenterButton}
          onClick={() => {
            const node = graph.getNode(entity.id)
            centerNode(node)
          }}
        >
          {entity.label} ({entity.type})
        </button>
        {/* <button
          className={styles.CenterButton}
          onClick={() => {
            const node = graph.getNode(entity.id)
            forceGraph.centerAt(node.x, node.y, 400)
          }}
        >
          <CenterIcon />
        </button> */}
        <button
          className={styles.RemoveButton}
          onClick={() => {
            setSelectedNodeIds(
              new Set([...selectedNodeIds].filter(id => id !== entity.id))
            )
          }}
        >
          &times;
        </button>
      </header>
      <div>
        {entity.startDate} - {entity.endDate}
      </div>
      <div>
        {entity.uris.map(uri => (
          <a className={styles.EntityLink} href={uri} key={uri}>
            {uri}
          </a>
        ))}
      </div>
      <div>
        <span>Add relations:</span>
        {Object.entries(entity.relations).map(([type, relations]) =>
          relations.length ? (
            <Button
              className={styles.RelationsButton}
              key={type}
              onClick={() => graph.addEdges(relations)}
              style={{ backgroundColor: colors[type] }}
              title={`Add ${relations.length} relation${
                relations.length > 1 ? 's' : ''
              } to ${type.toLowerCase() + 's'}`}
            >
              {relations.length}
            </Button>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Entity
