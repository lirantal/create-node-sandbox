import { stat } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'

export async function doesDockerExist(executable: string) {
  const path = process.env.PATH
  const allPaths = path?.split(':')

  if (allPaths && Array.isArray(allPaths)) {
    const listExecutableFinder: Promise<boolean>[] = allPaths?.map((systemPath: string) => {
      return isExecutableInPath(systemPath, executable)
    })

    const res = await Promise.any(listExecutableFinder)
    console.log(res)
  } else {
    throw 'Error: no paths defined in environment'
  }
}

async function isExecutableInPath(systemPath: string, executable: string) {
  const filePath = pathJoin(systemPath, executable)
  await stat(filePath)
  return true
}
