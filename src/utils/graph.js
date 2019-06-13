import { EventEmitter } from 'events'

export const createGraph = () => {
  const emitter = new EventEmitter()

  const nodes = new Map()
  const edges = new Map()

  return {
    emitter,

    nodes,
    edges,

    createNode(node) {
      const { id, type, label } = node
      return {
        id,
        type,
        label,
        neighbors: new Set(),
      }
    },

    createEdge(edge) {
      const { id, type, label, source, target } = edge
      return {
        id,
        type,
        label,
        source: this.addNode(source),
        target: this.addNode(target),
      }
    },

    addNode(node) {
      const { id } = node

      if (!this.nodes.has(id)) {
        this.nodes.set(id, this.createNode(node))
        this.emitter.emit('nodeAdded', id)
      }

      return this.getNode(id)
    },

    addEdge(edge) {
      const { id } = edge

      if (!this.edges.has(id)) {
        const { source, target } = edge

        this.edges.set(id, this.createEdge(edge))
        this.emitter.emit('edgeAdded', id)

        this.addNeighbor(source.id, target.id)
        this.addNeighbor(target.id, source.id)
      }

      return this.getEdge(id)
    },

    addEdges(edges) {
      const newEdges = edges.filter(({ id }) => !this.edges.has(id))
      if (newEdges.length) {
        newEdges.forEach(edge => this.addEdge(edge))
        this.emitter.emit('edgesAdded', newEdges.map(({ id }) => id))
      }
    },

    getNode(id) {
      return this.nodes.get(id)
    },

    getNodes() {
      return [...this.nodes.values()]
    },

    getEdge(id) {
      return this.edges.get(id)
    },

    getEdges() {
      return [...this.edges.values()]
    },

    addNeighbor(id, neighborId) {
      const node = this.getNode(id) || {}

      if (node) {
        node.neighbors.add(neighborId)
      }

      return node.neighbors
    },

    getNeighbors(id) {
      const node = this.getNode(id) || {}
      return node.neighbors
    },

    clear() {
      this.nodes = new Map()
      this.edges = new Map()
      this.emitter.emit('graphCleared')
    },
  }
}
