import type { ForceAtlas2Settings } from 'graphology-layout-forceatlas2'
import type { Settings } from 'sigma/settings'

import type { ApisEntityType } from '@/features/apis/types'

export const defaultNodeSize = 4

export const edgeHighlightSize = 2

export const animationDuration = 500

export const colors: {
  node: Record<ApisEntityType, string>
  edge: string
  fade: { node: string; edge: string }
} = {
  node: {
    Event: '#FF3333',
    Institution: '#009900',
    Person: '#660066',
    Place: '#FFCC66',
    Work: '#00CCCC',
  },
  edge: '',
  fade: {
    node: '#bbb',
    edge: '#eee',
  },
}

export const layoutOptions: ForceAtlas2Settings = {
  barnesHutOptimize: true,
  gravity: 0.05,
  outboundAttractionDistribution: false,
  scalingRatio: 10,
  slowDown: 15,
  strongGravityMode: true,
}

export const rendererOptions: Partial<Settings> = {
  allowInvalidContainer: true,
  minCameraRatio: 0.1,
  maxCameraRatio: 100,
}
