// TODO: Would probably be more readable if we just did string concatenation

import { colors } from '../utils/api'

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>'

export const convertToGraphML = (nodes, edges) => {
  const doc = new Document()

  const graphMlElement = doc.createElement('graphml')
  graphMlElement.setAttribute('xmlns', 'http://graphml.graphdrawing.org/xmlns')
  graphMlElement.setAttribute(
    'xmlns:xsi',
    'http://www.w3.org/2001/XMLSchema-instance'
  )
  graphMlElement.setAttribute(
    'xsi:schemaLocation',
    'http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd'
  )

  const labelAttribute = doc.createElement('key')
  labelAttribute.setAttribute('id', 'label')
  labelAttribute.setAttribute('for', 'node')
  labelAttribute.setAttribute('attr.name', 'label')
  labelAttribute.setAttribute('attr.type', 'string')
  graphMlElement.appendChild(labelAttribute)

  const colorAttribute = doc.createElement('key')
  colorAttribute.setAttribute('id', 'color')
  colorAttribute.setAttribute('for', 'node')
  colorAttribute.setAttribute('attr.name', 'color')
  colorAttribute.setAttribute('attr.type', 'string')
  graphMlElement.appendChild(colorAttribute)

  const graphElement = doc.createElement('graph')
  graphElement.setAttribute('id', 'graph')
  graphElement.setAttribute('edgedefault', 'directed')

  const nodesElement = doc.createElement('nodes')
  const edgesElement = doc.createElement('edges')

  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)
  graphMlElement.appendChild(graphElement)
  doc.appendChild(graphMlElement)

  nodes.forEach(node => {
    const nodeElement = doc.createElement('node')
    nodeElement.setAttribute('id', node.id)
    if (node.label) {
      const data = doc.createElement('data')
      data.setAttribute('key', 'label')
      const label = doc.createTextNode(node.label)
      data.appendChild(label)
      nodeElement.appendChild(data)
    }
    if (node.type) {
      const data = doc.createElement('data')
      data.setAttribute('key', 'color')
      const label = doc.createTextNode(colors[node.type.label || node.type])
      data.appendChild(label)
      nodeElement.appendChild(data)
    }
    nodesElement.appendChild(nodeElement)
  })

  edges.forEach(edge => {
    const edgeElement = doc.createElement('edge')
    edgeElement.setAttribute('id', edge.id)
    edgeElement.setAttribute('source', edge.source.id || edge.source)
    edgeElement.setAttribute('target', edge.target.id || edge.target)
    edgesElement.appendChild(edgeElement)
  })

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
}

export const convertToGexf = (nodes, edges) => {
  const doc = new Document()

  const gexfElement = doc.createElement('gexf')
  gexfElement.setAttribute('xmlns', 'http://www.gexf.net/1.3draft')
  gexfElement.setAttribute('version', '1.3')
  gexfElement.setAttribute(
    'xmlns:xsi',
    'http://www.w3.org/2001/XMLSchema-instance'
  )
  gexfElement.setAttribute(
    'xsi:schemaLocation',
    'http://www.gexf.net/1.3draft/gexf.xsd'
  )
  gexfElement.setAttribute('xmlns:viz', 'http://www.gexf.net/1.3draft/viz')

  const graphElement = doc.createElement('graph')
  graphElement.setAttribute('mode', 'static')
  graphElement.setAttribute('defaultedgetype', 'directed')

  const nodesElement = doc.createElement('nodes')
  const edgesElement = doc.createElement('edges')

  graphElement.appendChild(nodesElement)
  graphElement.appendChild(edgesElement)
  gexfElement.appendChild(graphElement)
  doc.appendChild(gexfElement)

  nodes.forEach(node => {
    const nodeElement = doc.createElement('node')
    nodeElement.setAttribute('id', node.id)
    if (node.label) {
      nodeElement.setAttribute('label', node.label)
    }
    if (node.type) {
      const colorElement = doc.createElement('viz:color')
      colorElement.setAttribute('hex', colors[node.type.label || node.type])
      nodeElement.appendChild(colorElement)
    }
    nodesElement.appendChild(nodeElement)
  })

  edges.forEach(edge => {
    const edgeElement = doc.createElement('edge')
    edgeElement.setAttribute('id', edge.id)
    edgeElement.setAttribute('source', edge.source.id || edge.source)
    edgeElement.setAttribute('target', edge.target.id || edge.target)
    edgesElement.appendChild(edgeElement)
  })

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(doc)

  return [xmlDeclaration, xml].join('\n')
}
