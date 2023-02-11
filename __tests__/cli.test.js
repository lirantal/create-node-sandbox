import { afterEach, describe, expect, it, vi } from 'vitest'

import { spawn } from 'node:child_process'
import { main } from '../src/main.js'

vi.mock('node:child_process')

afterEach(() => {
  vi.clearAllMocks()
})

describe('CLI should call spawn and execute the docker binary', () => {
  it('calls the docker binary to create a sandbox', () => {
    main()

    expect(spawn).toBeCalledTimes(1)
  })
})
