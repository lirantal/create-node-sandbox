import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as env from '../src/env'
import * as mainModule from '../src/main'

// Mock the environment functions
vi.mock('../src/env', () => ({
  doesDockerExist: vi.fn(),
  isDockerRunning: vi.fn(),
  isDockerImageAvailable: vi.fn()
}))

// Mock child_process.spawn
vi.mock('node:child_process', () => ({
  default: {
    spawn: vi.fn()
  },
  spawn: vi.fn()
}))

// Mock the main function to prevent it from executing
vi.mock('../src/main', () => ({
  main: vi.fn()
}))

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => {})

describe('Docker image not available error handling', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should suggest docker pull command when image is not available', async () => {
    // Arrange: Mock successful Docker existence and running checks
    env.doesDockerExist.mockResolvedValue()
    env.isDockerRunning.mockResolvedValue({ stdout: 'CONTAINER ID...', stderr: '' })

    // Mock image availability check to fail
    env.isDockerImageAvailable.mockRejectedValue(new Error('Image not found'))

    // Import and execute the CLI initialization
    const { init } = await import('../src/bin/cli.ts')

    // Act: Execute the init function
    await init()

    // Assert: Verify that process.exit was called with code 1
    expect(mockProcessExit).toHaveBeenCalledWith(1)

    // Verify that the error message includes the docker pull command
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('docker pull node:18-bullseye-slim')
    )
  })

  it('should suggest correct docker pull command for custom image', async () => {
    // Arrange: Mock successful Docker existence and running checks
    env.doesDockerExist.mockResolvedValue()
    env.isDockerRunning.mockResolvedValue({ stdout: 'CONTAINER ID...', stderr: '' })

    // Mock image availability check to fail for custom image
    env.isDockerImageAvailable.mockRejectedValue(new Error('Image not found'))

    // Mock process.argv to simulate --image flag
    const originalArgv = process.argv
    process.argv = ['node', 'cli.js', '--image', 'node:20-alpine']

    try {
      // Import and execute the CLI initialization
      const { init } = await import('../src/bin/cli.ts')

      // Act: Execute the init function
      await init()

      // Assert: Verify that process.exit was called with code 1
      expect(mockProcessExit).toHaveBeenCalledWith(1)

      // Verify that the error message includes the docker pull command for custom image
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('docker pull node:20-alpine')
      )
    } finally {
      // Restore original argv
      process.argv = originalArgv
    }
  })
})
