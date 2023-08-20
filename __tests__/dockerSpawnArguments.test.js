import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import child_process from 'node:child_process'
import { main } from '../src/main'

vi.mock('node:child_process')

let mockedSpawn
beforeEach(() => {
  mockedSpawn = vi.spyOn(child_process, 'spawn').mockImplementation()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('CLI should parse and use command line arguments and map them correctly', () => {
  it('users can specify their own container image', () => {
    main({ image: 'node:1.0' })

    expect(mockedSpawn).toBeCalledTimes(1)
    const haveBeenCalledWith = mockedSpawn.mock.calls[0]
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

    expect(mockedSpawn).toBeCalledTimes(1)
    const haveBeenCalledWith = mockedSpawn.mock.calls[0]
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

  it('users who specify a node version will allow to pull that', () => {
    main({ node: '16' })

    expect(mockedSpawn).toBeCalledTimes(1)
    const haveBeenCalledWith = mockedSpawn.mock.calls[0]
    expect(haveBeenCalledWith[1]).toEqual([
      'run',
      '--rm',
      '-it',
      '--security-opt',
      'no-new-privileges',
      '--entrypoint',
      'bash',
      'node:16-bullseye-slim'
    ])
  })

  it('users who specify both a node image and a node version will learn that image takes precedents', () => {
    main({ node: '16', image: 'node:14-bullseye' })

    expect(mockedSpawn).toBeCalledTimes(1)
    const haveBeenCalledWith = mockedSpawn.mock.calls[0]
    expect(haveBeenCalledWith[1]).toEqual([
      'run',
      '--rm',
      '-it',
      '--security-opt',
      'no-new-privileges',
      '--entrypoint',
      'bash',
      'node:14-bullseye'
    ])
  })
})
