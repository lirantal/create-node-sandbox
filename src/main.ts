import { spawn } from 'node:child_process'
import { env } from 'node:process'

export function main(sandboxOptions: { image: string; resumable: string }) {
  const allowedEnvVars = { PATH: env.PATH }

  const { image, resumable } = sandboxOptions

  spawn(
    'docker',
    [
      'run',
      '--rm',
      '-it',
      '--security-opt',
      'no-new-privileges',
      '--entrypoint',
      'bash',
      image ? image : 'node:18-bullseye-slim'
    ],
    {
      stdio: 'inherit',
      env: allowedEnvVars
    }
  )
}
