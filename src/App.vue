<script setup lang="ts">
import { ref } from 'vue'
import GraphVisualization from './components/GraphVisualization.vue'
import { fetchRepoStructure } from './utils/github'
import { GraphData, RepoNode, GraphNode, GraphLink } from './types'
import { getFileColor } from './utils/fileUtils'

const repoUrl = ref('')
const graphData = ref<GraphData>({ nodes: [], links: [] })
const loading = ref(false)
const error = ref('')
const zoom = ref(100)

const fileTypes = [
  { name: 'Vue', color: '#41B883' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'Styles', color: '#FF69B4' },
  { name: 'Folder', color: '#3b82f6' }
]

async function handleSubmit() {
  if (!repoUrl.value) {
    error.value = 'Por favor ingresa una URL de GitHub'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const urlParts = repoUrl.value.split('/')
    const owner = urlParts[urlParts.length - 2]
    const repo = urlParts[urlParts.length - 1]

    if (!owner || !repo) {
      throw new Error('URL de repositorio inválida')
    }

    const structure = await fetchRepoStructure(owner, repo)
    graphData.value = transformToGraphData(structure)
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Error al obtener los datos del repositorio'
    graphData.value = { nodes: [], links: [] }
  } finally {
    loading.value = false
  }
}

function resetView() {
  zoom.value = 100
}

function decreaseZoom() {
  zoom.value = Math.max(zoom.value - 10, 10)
}

function increaseZoom() {
  zoom.value = Math.min(zoom.value + 10, 200)
}

function transformToGraphData(structure: RepoNode[]): GraphData {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  function processNode(node: RepoNode, parentId?: string) {
    nodes.push({
      id: node.id,
      name: node.name,
      type: node.type,
      extension: node.extension,
      color: getFileColor(node.type, node.extension)
    })

    if (parentId) {
      links.push({
        source: parentId,
        target: node.id
      })
    }

    if (node.children) {
      Object.values(node.children).forEach(child => {
        processNode(child, node.id)
      })
    }
  }

  structure.forEach(node => processNode(node))
  return { nodes, links }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white"
  >
    <div class="mx-auto max-w-7xl px-4 py-16">
      <!-- Header -->
      <div class="relative mb-16 text-center">
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#41B88366] to-[#3178C666] opacity-20 blur-3xl"
        ></div>
        <h1
          class="relative mb-4 bg-gradient-to-r from-[#41B883] to-[#3178C6] bg-clip-text text-6xl font-bold text-transparent"
        >
          Vue Project Visualizer
        </h1>
        <p class="relative text-lg text-gray-400">
          Visualiza la estructura de repositorios Vue.js, Nuxt.js y Astro+Vue
        </p>
      </div>

      <!-- Search Form -->
      <div class="mx-auto mb-12 max-w-7xl">
        <div
          class="rounded-2xl border border-white/10 bg-[#2a2a2a]/50 p-4 shadow-xl backdrop-blur-xl"
        >
          <div class="flex gap-3">
            <div class="relative flex-1">
              <div
                class="pointer-events-none absolute inset-y-0 left-4 flex items-center"
              >
                <svg
                  class="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <input
                v-model="repoUrl"
                type="text"
                placeholder="https://github.com/usuario/repositorio"
                class="w-full rounded-xl border border-white/10 bg-[#1a1a1a]/50 px-12 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-[#41B883]/50 focus:ring-2 focus:ring-[#41B883]/20"
              />
            </div>
            <button
              @click="handleSubmit"
              :disabled="loading"
              class="flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#41B883] to-[#3178C6] px-8 py-3 font-medium text-white shadow-lg shadow-[#41B883]/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                v-if="loading"
                class="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ loading ? 'Cargando...' : 'Visualizar' }}</span>
            </button>
          </div>
          <p v-if="error" class="mt-3 text-center text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Controls Card -->
      <div v-if="graphData.nodes.length" class="mx-auto mb-8 max-w-7xl">
        <div
          class="rounded-2xl border border-white/10 bg-[#2a2a2a]/50 p-6 shadow-xl backdrop-blur-xl"
        >
          <div
            class="mb-6 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#3a3a3a]/50 px-6 py-3"
          >
            <!-- Reset View Button -->
            <button
              @click="resetView"
              class="group flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#3a3a3a]/50 p-3 text-white transition-all hover:bg-[#4a4a4a]/50"
            >
              <svg
                class="h-5 w-5 transition-transform duration-500 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="font-medium">Restablecer vista</span>
            </button>

            <!-- Zoom Controls -->
            <div class="flex items-center justify-between gap-4">
              <button
                @click="decreaseZoom"
                class="rounded-lg p-3 text-white transition-all hover:bg-[#4a4a4a]/50"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span
                class="min-w-[4rem] text-center text-xl font-medium tabular-nums"
              >
                {{ zoom }}%
              </span>
              <button
                @click="increaseZoom"
                class="rounded-lg p-3 text-white transition-all hover:bg-[#4a4a4a]/50"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            <!-- File Type Legend -->
            <div class="flex gap-4">
              <div
                v-for="type in fileTypes"
                :key="type.name"
                class="group flex items-center gap-3 rounded-xl border border-white/5 p-3 transition-all hover:bg-[#3a3a3a]/50"
              >
                <span
                  class="h-4 w-4 rounded-full transition-transform group-hover:scale-110"
                  :style="{ backgroundColor: type.color }"
                >
                </span>
                <span class="font-medium text-gray-300">{{ type.name }}</span>
              </div>
            </div>
          </div>

          <!-- Graph Visualization -->
          <div
            v-if="graphData.nodes.length"
            class="mt-8 rounded-2xl border border-white/10 bg-[#2a2a2a]/30 p-4 shadow-xl backdrop-blur-sm"
          >
            <GraphVisualization :data="graphData" :zoom="zoom" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background: #1a1a1a;
  min-height: 100vh;
}

/* Glassmorphism scrollbar */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: rgba(26, 26, 26, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 3px solid rgba(26, 26, 26, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
