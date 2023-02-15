import childProcesses from 'node:child_process'
import { promisify } from 'node:util'
import { stat } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'

const execFile = promisify(childProcesses.execFile)

export async function doesDockerExist(executable: string) {
  const path = process.env.PATH
  const allPaths = path?.split(':')

  if (allPaths && Array.isArray(allPaths)) {
    const listExecutableFinder: Promise<boolean>[] = allPaths?.map((systemPath: string) => {
      return isExecutableInPath(systemPath, executable)
    })

    await Promise.any(listExecutableFinder)
  } else {
    throw 'Error: no paths defined in environment'
  }
}

export async function isDockerRunning(executable: string) {
  await execFile(executable, ['ps'])
}

export async function isDockerImageAvailable(executable: string, dockerImageName: string) {
  await execFile(executable, ['image', 'inspect', dockerImageName])
}

async function isExecutableInPath(systemPath: string, executable: string) {
  const filePath = pathJoin(systemPath, executable)
  await stat(filePath)
  return true
}
