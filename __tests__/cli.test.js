import { afterEach, describe, expect, it, vi } from 'vitest'

import { spawn } from 'node:child_process'
import { main } from '../src/main'

vi.mock('node:child_process')

afterEach(() => {
  vi.clearAllMocks()
})

describe('CLI should call spawn and execute the docker binary', () => {
  it('calls the docker binary to create a sandbox', () => {
    main()

    expect(spawn).toBeCalledTimes(1)
    const haveBeenCalledWith = spawn.mock.calls[0]
    expect(haveBeenCalledWith[0]).toBe('docker')
  })

  it('calls the docker binary along with optional arguments', () => {
    main()

    expect(spawn).toBeCalledTimes(1)
    const haveBeenCalledWith = spawn.mock.calls[0]
    expect(haveBeenCalledWith[1]).toEqual([
      'run',
      '--rm',
      '-it',
      '--security-opt',
      'no-new-privileges',
      '--entrypoint',
      'bash',
      'node:18-bullseye-slim'
    ])
  })

  it('spins off the sandbox environment without exposing environment variables', () => {
    main()

    expect(spawn).toBeCalledTimes(1)
    const haveBeenCalledWith = spawn.mock.calls[0]
    expect(haveBeenCalledWith[2]).toEqual({
      stdio: 'inherit',
      env: { PATH: process.env.PATH }
    })
  })
})
