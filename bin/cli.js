#!/usr/bin/env node

import { spawn } from 'node:child_process'

spawn('docker', ['run', '-it', '--entrypoint', 'bash', 'node:18-bullseye-slim'], {
  stdio: 'inherit'
})
