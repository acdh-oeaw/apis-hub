import React from 'react'

import ExportButtons from '../ExportButtons/ExportButtons'

import Button from '../../elements/Button/Button'
import Input from '../../elements/Input/Input'
import Popover from '../../elements/Popover/Popover'
import Select from '../../elements/Select/Select'
import Toggle from '../../elements/Toggle/Toggle'

import styles from './Controls.module.css'

import classNames from '../../utils/class-names'

const dagModes = [
  [null, 'default'],
  ['td', 'top-down'],
  ['bu', 'bottom-up'],
  ['lr', 'left-right'],
  ['rl', 'right-left'],
  ['radialout', 'radial out'],
  ['radialin', 'radial in'],
]

const Controls = ({
  className,
  dagMode,
  dispatch,
  forceGraph,
  graph,
  is3D,
  // isGraphLoading,
  isLeftPanelOpen,
  isRightPanelOpen,
  isSimulationRunning,
  onSelectDagMode,
  onSelectShowNeighborsOnly,
  onSelectZoom,
  selectedNodeIds,
  setHighlightedNodeIds,
  setIs3D,
  setIsLeftPanelOpen,
  setIsRightPanelOpen,
  showNeighborsOnly,
  zoom,
  ...rest
}) => (
  <div className={classNames(styles.Controls, className)} {...rest}>
    <Button
      className={styles.Button}
      onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
    >
      {isLeftPanelOpen ? 'Hide relations' : 'Add relations'}
    </Button>

    <Statistics
      graph={graph}
      isSimulationRunning={isSimulationRunning}
      zoom={zoom}
    />

    <Popover label="Options">
      <div>
        <Select
          className={styles.SelectMode}
          label="DAG Mode"
          onSelect={event => {
            onSelectDagMode(event.target.value)
          }}
          options={dagModes}
          selected={dagMode}
        />
      </div>

      <div className={styles.Toggle}>
        <span>2D</span>
        <Toggle onToggle={setIs3D} checked={is3D} />
        <span>3D</span>
      </div>

      <Button
        className={styles.PopoverButton}
        onClick={() => {
          forceGraph.refresh()
        }}
      >
        Refresh
      </Button>

      <Button
        className={styles.PopoverButton}
        onClick={() => {
          // TODO: Better would if we didn't have to invalidate the whole relations cache
          // i.e. save something like `idsInGraph`
          dispatch({ type: 'CLEAR_RELATIONS' })
          graph.clear()
        }}
      >
        Clear
      </Button>

      {graph && graph.nodes.size ? <ExportButtons graph={graph} /> : null}
    </Popover>

    <form
      className={styles.Highlight}
      onSubmit={event => {
        event.preventDefault()
        const value = event.target.elements.search.value.toLowerCase()
        if (value) {
          const ids = graph
            .getNodes()
            .filter(node => node.label.toLowerCase().includes(value))
            .map(node => node.id)
          setHighlightedNodeIds(new Set(ids))
        } else {
          setHighlightedNodeIds(new Set())
        }
      }}
    >
      <Input
        className={styles.HighlightSearch}
        placeholder="Highlight nodes"
        type="search"
        id="search"
      />
      {/* <Button>Highlight</Button>
      <Button>Clear</Button>
      <Button>Select</Button> */}
    </form>

    <Button
      className={styles.Button}
      disabled={!selectedNodeIds.size}
      onClick={() => onSelectShowNeighborsOnly(!showNeighborsOnly)}
    >
      {showNeighborsOnly ? 'Show all nodes' : 'Show neighbors only'}
    </Button>

    <Button
      className={styles.Button}
      onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
    >
      {isRightPanelOpen ? 'Hide selection details' : 'Show selection details'}
    </Button>
  </div>
)

const Statistics = ({ graph, isSimulationRunning, zoom }) => (
  <div className={styles.Statistics}>
    <div className={styles.StatisticsItem}>
      <div>Nodes</div>
      <div className={styles.StatisticsNumber}>
        {graph ? graph.nodes.size : 0}
      </div>
    </div>
    <div className={styles.StatisticsItem}>
      <div>Edges</div>
      <div className={styles.StatisticsNumber}>
        {graph ? graph.edges.size : 0}
      </div>
    </div>
    <div className={styles.StatisticsItem}>
      <div>
        {isSimulationRunning ? 'Running simulation ...' : 'Simulation finished'}
      </div>
      <div>Zoom: {(zoom && zoom.k.toFixed(2)) || 1}</div>
    </div>
  </div>
)

export default Controls
