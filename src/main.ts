import { spawn } from 'node:child_process'
import { env } from 'node:process'

export function main(sandboxOptions: { image: string; resumable: string }) {
  const allowedEnvVars = { PATH: env.PATH }

  const { image, resumable } = sandboxOptions

  const dockerSpawnArguments: string[] = []
  dockerSpawnArguments.push('run')
  !resumable ? dockerSpawnArguments.push('--rm') : null
  dockerSpawnArguments.push('-it')
  dockerSpawnArguments.push('--security-opt', 'no-new-privileges')
  dockerSpawnArguments.push('--entrypoint', 'bash')
  image ? dockerSpawnArguments.push(image) : 'node:18-bullseye-slim'

  spawn('docker', dockerSpawnArguments, {
    stdio: 'inherit',
    env: allowedEnvVars
  })
}
