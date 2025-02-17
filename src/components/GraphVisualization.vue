<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import { GraphData, GraphNode, GraphLink } from '../types'
import { getFileColor } from '../utils/fileUtils'

const props = defineProps<{
  data: GraphData
  zoom?: number
}>()

const svgRef = ref<SVGSVGElement>()
let simulation: d3.Simulation<GraphNode, GraphLink>

onMounted(() => {
  initializeGraph()
})

watch(
  () => props.data,
  newData => {
    if (newData) {
      updateGraph()
    }
  }
)

watch(
  () => props.zoom,
  newZoom => {
    if (newZoom && svgRef.value) {
      updateZoom(newZoom)
    }
  }
)

function updateZoom(zoom: number) {
  const svg = d3.select(svgRef.value)
  const scale = zoom / 100
  svg.attr('transform', `scale(${scale})`)
}

function initializeGraph() {
  const svg = d3.select(svgRef.value)
  const width = window.innerWidth
  const height = window.innerHeight - 200

  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('class', 'transition-transform duration-200')

  simulation = d3
    .forceSimulation<GraphNode>(props.data.nodes)
    .force(
      'link',
      d3.forceLink<GraphNode, GraphLink>(props.data.links).id(d => d.id)
    )
    .force('charge', d3.forceManyBody().strength(-150))
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = svg
    .append('g')
    .selectAll('line')
    .data(props.data.links)
    .join('line')
    .attr('stroke', '#e5e7eb')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.6)

  const nodeGroup = svg
    .append('g')
    .selectAll('g')
    .data(props.data.nodes)
    .join('g')
    .call(
      d3
        .drag<any, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    )

  // Node circle with shadow
  nodeGroup
    .append('circle')
    .attr('r', 6)
    .attr('fill', d => getFileColor(d.type, d.extension))
    .attr('class', 'shadow-lg transition-all duration-200')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  // Node label background
  nodeGroup
    .append('rect')
    .attr('x', 10)
    .attr('y', -10)
    .attr('width', d => d.name.length * 7 + 10)
    .attr('height', 20)
    .attr('rx', 4)
    .attr('fill', 'white')
    .attr('class', 'shadow-sm opacity-80')

  // Node label
  nodeGroup
    .append('text')
    .text(d => d.name)
    .attr('x', 15)
    .attr('y', 3)
    .attr('class', 'text-sm font-medium fill-gray-700')

  simulation.on('tick', () => {
    link
      .attr('x1', d => (d.source as GraphNode).x!)
      .attr('y1', d => (d.source as GraphNode).y!)
      .attr('x2', d => (d.target as GraphNode).x!)
      .attr('y2', d => (d.target as GraphNode).y!)

    nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`)
  })
}

function dragstarted(event: any) {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
}

function dragged(event: any) {
  event.subject.fx = event.x
  event.subject.fy = event.y
}

function dragended(event: any) {
  if (!event.active) simulation.alphaTarget(0)
  event.subject.fx = null
  event.subject.fy = null
}

function updateGraph() {
  // Implementation for updating the graph when data changes
}
</script>

<template>
  <svg ref="svgRef" class="w-full"></svg>
</template>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

text {
  font-size: 12px;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

/* Hover effects */
g:hover circle {
  r: 8;
  filter: brightness(1.1);
}

g:hover text {
  font-weight: 600;
}
</style>
