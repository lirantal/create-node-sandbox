#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { env } from 'node:process'

const allowedEnvVars = { PATH: env.PATH }

spawn('docker', ['run', '--rm', '-it', '--entrypoint', 'bash', 'node:18-bullseye-slim'], {
  stdio: 'inherit',
  env: allowedEnvVars
})
