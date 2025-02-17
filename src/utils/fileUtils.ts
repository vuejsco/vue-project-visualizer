export const VUE_PATTERNS = ['vue', '@vue/cli', '@vitejs/plugin-vue']
export const NUXT_PATTERNS = ['nuxt', 'nuxt3', '@nuxt', '@nuxtjs']
export const ASTRO_VUE_PATTERNS = ['@astrojs/vue', 'astro-vue']

export const CODE_FILE_EXTENSIONS = [
  // Vue files
  '.vue',
  // JavaScript
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  // TypeScript
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  // Styles
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.styl',
  // Templates
  '.html',
  '.pug'
]

export const FILE_COLORS = {
  '.vue': '#41B883',
  '.js': '#F7DF1E',
  '.jsx': '#F7DF1E',
  '.mjs': '#F7DF1E',
  '.cjs': '#F7DF1E',
  '.ts': '#3178C6',
  '.tsx': '#3178C6',
  '.mts': '#3178C6',
  '.cts': '#3178C6',
  '.css': '#FF69B4',
  '.scss': '#FF69B4',
  '.sass': '#FF69B4',
  '.less': '#FF69B4',
  '.styl': '#FF69B4',
  '.html': '#E34F26',
  '.pug': '#E34F26',
  folder: '#3b82f6'
}

export const isCodeFile = (filename: string): boolean => {
  const extension = filename.slice(filename.lastIndexOf('.'))
  return CODE_FILE_EXTENSIONS.includes(extension)
}

export const getFileColor = (type: string, extension?: string): string => {
  if (type === 'folder') return FILE_COLORS.folder
  return FILE_COLORS[extension as keyof typeof FILE_COLORS] || '#808080'
}
