import childProcesses from 'node:child_process'
import { promisify } from 'node:util'
import { stat } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'
import type { Stats } from 'node:fs'

const execFile = promisify(childProcesses.execFile)

export async function doesDockerExist(executable: string) {
  const path = process.env.PATH
  const allPaths = path?.split(':')

  if (allPaths && Array.isArray(allPaths)) {
    const listExecutableFinder: Promise<Stats>[] = allPaths?.map((systemPath: string) => {
      return isExecutableInPath(systemPath, executable)
    })

    await Promise.any(listExecutableFinder)
  } else {
    throw 'Error: no paths defined in environment'
  }
}

export function isDockerRunning(executable: string) {
  return execFile(executable, ['ps'])
}

export function isDockerImageAvailable(executable: string, dockerImageName: string) {
  return execFile(executable, ['image', 'inspect', dockerImageName])
}

function isExecutableInPath(systemPath: string, executable: string) {
  const filePath = pathJoin(systemPath, executable)
  return stat(filePath)
}
