// TODO: Would probably be more readable if we just did string concatenation

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
  gexfElement.setAttribute('xmlns', 'http://www.gexf.net/1.2draft')
  gexfElement.setAttribute('version', '1.2')
  gexfElement.setAttribute(
    'xmlns:xsi',
    'http://www.w3.org/2001/XMLSchema-instance'
  )
  gexfElement.setAttribute(
    'xsi:schemaLocation',
    'http://www.gexf.net/1.2draft/gexf.xsd'
  )

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
