export interface RepoNode {
  id: string
  name: string
  type: 'file' | 'folder'
  extension?: string
  path: string
  children?: RepoNode[]
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: 'file' | 'folder'
  extension?: string
  color: string
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
