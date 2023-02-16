import { afterEach, describe, expect, it, vi } from 'vitest'

import { spawn } from 'node:child_process'
import { main } from '../src/main'

vi.mock('node:child_process')

afterEach(() => {
  vi.clearAllMocks()
})

describe('CLI should parse and use command line arguments and map them correctly', () => {
  it('users can specify their own container image', () => {
    main({ image: 'node:1.0' })

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
      'node:1.0'
    ])
  })

  it('users can specify that the container wont get deleted', () => {
    main({ resumable: true })

    expect(spawn).toBeCalledTimes(1)
    const haveBeenCalledWith = spawn.mock.calls[0]
    expect(haveBeenCalledWith[1]).toEqual([
      'run',
      '-it',
      '--security-opt',
      'no-new-privileges',
      '--entrypoint',
      'bash',
      'node:18-bullseye-slim'
    ])
  })
})
