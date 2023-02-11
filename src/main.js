import { spawn } from 'node:child_process'
import { env } from 'node:process'

export function main() {
  const allowedEnvVars = { PATH: env.PATH }

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
      'node:18-bullseye-slim'
    ],
    {
      stdio: 'inherit',
      env: allowedEnvVars
    }
  )
}
