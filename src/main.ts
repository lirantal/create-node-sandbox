import child_process from 'node:child_process'
import { env } from 'node:process'

const DEFAULT_NODE_VERSION = '18'
const DEFAULT_NODE_IMAGE_TAG = 'bullseye-slim'

function getNodeDockerImage(
  nodeVersion: string | null = null,
  nodeBaseImage: string | null = null
): string {
  return `node:${nodeVersion ? nodeVersion : DEFAULT_NODE_VERSION}-${
    nodeBaseImage ? nodeBaseImage : DEFAULT_NODE_IMAGE_TAG
  }`
}

export function main(sandboxOptions: { image: string; node: string; resumable: boolean }) {
  const allowedEnvVars = { PATH: env.PATH }

  const { image, resumable, node } = sandboxOptions

  let nodeContainerImage = getNodeDockerImage()
  const dockerSpawnArguments: string[] = []

  dockerSpawnArguments.push('run')
  !resumable ? dockerSpawnArguments.push('--rm') : null
  dockerSpawnArguments.push('-it')
  dockerSpawnArguments.push('--security-opt', 'no-new-privileges')
  dockerSpawnArguments.push('-u', 'node')
  dockerSpawnArguments.push('--entrypoint', 'bash')

  if (!!node) {
    nodeContainerImage = getNodeDockerImage(node)
  }

  // if an image is provided then it takes precedents over
  // a specified node version
  if (!!image) {
    nodeContainerImage = image
  }

  dockerSpawnArguments.push(nodeContainerImage)

  child_process.spawn('docker', dockerSpawnArguments, {
    stdio: 'inherit',
    env: allowedEnvVars
  })
}
