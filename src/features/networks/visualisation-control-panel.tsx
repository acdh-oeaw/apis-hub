import {
  DesktopComputerIcon,
  MinusCircleIcon,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  SaveIcon,
  StopIcon,
  SupportIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import cx from 'clsx'
import type { ChangeEvent, ComponentProps, ComponentPropsWithoutRef, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import { Panel } from '@/features/networks/panel'
import { Separator } from '@/features/networks/separator'
import { useVisualisation } from '@/features/networks/visualisation'
import { downloadFile } from '@/lib/download-file'
import type { ApisInstanceConfig } from '~/config/apis.config'
import { animationDuration } from '~/config/visualisation.config'

interface VisualisationControlPanelProps {
  instance: ApisInstanceConfig
}

export function VisualisationControlPanel(
  props: VisualisationControlPanelProps,
): JSX.Element | null {
  const { instance } = props

  const { layout, renderer } = useVisualisation()
  const queryClient = useQueryClient()

  function onZoomIn() {
    renderer?.getCamera().animatedZoom({ duration: animationDuration, factor: 1.5 })
  }

  function onZoomOut() {
    renderer?.getCamera().animatedUnzoom({ duration: animationDuration, factor: 1.5 })
  }

  function onFitToViewport() {
    renderer?.getCamera().animatedReset({ duration: animationDuration })
  }

  function onToggleFullScreen() {
    if (!document.fullscreenEnabled) return

    const element = renderer?.getContainer() ?? null
    if (element == null) return

    if (document.fullscreenElement === element) {
      document.exitFullscreen()
    } else {
      element.requestFullscreen()
    }
  }

  function onChangeLabelVisibilitySizeThreshold(event: ChangeEvent<HTMLInputElement>) {
    renderer?.setSetting('labelRenderedSizeThreshold', event.currentTarget.valueAsNumber)
  }

  function onSaveAsGexf() {
    const graph = renderer?.getGraph()
    if (graph == null) return
    import('graphology-gexf/browser').then((module) => {
      const { write } = module
      downloadFile(write(graph), 'application/xml', 'graph.gexf')
    })
  }

  function onClearGraph() {
    renderer?.getGraph().clear()
    queryClient.removeQueries([instance.id, 'apis-relations'])
  }

  type LayoutStatus = 'paused' | 'running' | 'stopped'

  const [layoutStatus, setLayoutStatus] = useState<LayoutStatus>(() => {
    return layout?.isRunning() === true ? 'running' : 'paused'
  })

  const onStartLayout = useCallback(
    function onStartLayout() {
      if (layout == null) return
      layout.start()
      setLayoutStatus('running')
    },
    [layout],
  )

  const onPauseLayout = useCallback(
    function onPauseLayout() {
      if (layout == null) return
      layout.stop()
      setLayoutStatus('paused')
    },
    [layout],
  )

  const onStopLayout = useCallback(
    function onStopLayout() {
      if (layout == null) return
      layout.stop()
      setLayoutStatus('stopped')
    },
    [layout],
  )

  useEffect(() => {
    onStartLayout()
  }, [onStartLayout])

  useEffect(() => {
    const graph = renderer?.getGraph()
    if (graph == null) return

    function updateLayout() {
      if (layoutStatus !== 'stopped') {
        onStartLayout()
      }
    }

    graph.on('edgeAdded', updateLayout)

    return () => {
      graph.off('edgeAdded', updateLayout)
    }
  }, [renderer, layout, onStartLayout, layoutStatus])

  if (renderer == null) return null

  return (
    <Panel>
      <Button label="Zoom in" icon={PlusCircleIcon} onClick={onZoomIn} />
      <Button label="Zoom out" icon={MinusCircleIcon} onClick={onZoomOut} />
      <Button label="Reset zoom" icon={SupportIcon} onClick={onFitToViewport} />
      <Button
        disabled={!document.fullscreenEnabled}
        icon={DesktopComputerIcon}
        label="Toggle fullscreen"
        onClick={onToggleFullScreen}
      />
      <input
        aria-label="Change label visibility threshold"
        min={0}
        max={15}
        onChange={onChangeLabelVisibilitySizeThreshold}
        step={0.5}
        title="Change label visibility threshold"
        type="range"
      />
      <Separator />
      {layoutStatus === 'running' ? (
        <Button icon={PauseIcon} label="Pause layout" onClick={onPauseLayout} />
      ) : layoutStatus === 'paused' ? (
        <Button icon={StopIcon} label="Stop layout" onClick={onStopLayout} />
      ) : (
        <Button icon={PlayIcon} label="Start layout" onClick={onStartLayout} />
      )}
      <Separator />
      <Button
        icon={SaveIcon}
        label="Save as Graph Exchange XML Format (GEXF)"
        onClick={onSaveAsGexf}
      />
      <Button
        disabled={layoutStatus === 'running'}
        icon={TrashIcon}
        label="Clear graph"
        onClick={onClearGraph}
      />
    </Panel>
  )
}

interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'aria-label' | 'className' | 'title'> {
  icon: FC<ComponentProps<'svg'>>
  label: string
}

function Button(props: ButtonProps): JSX.Element {
  const { disabled, icon: Icon, label } = props

  return (
    <button
      {...props}
      aria-label={label}
      className={cx(
        'h-6 w-6 flex-shrink-0 hover:text-gray-600 transition-colors',
        disabled === true && 'text-gray-400 pointer-events-none',
      )}
      title={label}
    >
      <Icon aria-hidden />
    </button>
  )
}
