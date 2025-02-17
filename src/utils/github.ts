import axios from 'axios'
import { RepoNode } from '../types'
import { isCodeFile } from './fileUtils'

export async function fetchRepoStructure(
  owner: string,
  repo: string
): Promise<RepoNode[]> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`
    )

    const files = response.data.tree
      .filter((item: any) => item.type === 'blob' && isCodeFile(item.path))
      .map((item: any) => ({
        id: item.path,
        name: item.path.split('/').pop(),
        type: 'file',
        extension: item.path.slice(item.path.lastIndexOf('.')),
        path: item.path
      }))

    return buildFileTree(files)
  } catch (error) {
    throw new Error('Failed to fetch repository structure')
  }
}

function buildFileTree(files: RepoNode[]): RepoNode[] {
  const root: { [key: string]: RepoNode } = {}

  files.forEach(file => {
    const parts = file.path.split('/')
    let current = root

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = file
      } else {
        if (!current[part]) {
          current[part] = {
            id: parts.slice(0, index + 1).join('/'),
            name: part,
            type: 'folder',
            path: parts.slice(0, index + 1).join('/'),
            children: {}
          }
        }
        current = current[part].children as { [key: string]: RepoNode }
      }
    })
  })

  return Object.values(root)
}
