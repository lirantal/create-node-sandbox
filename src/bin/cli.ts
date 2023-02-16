#!/usr/bin/env node

import cfonts from 'cfonts'
import { main } from '../main'
import parser from 'yargs-parser'

import { doesDockerExist, isDockerImageAvailable, isDockerRunning } from '../env'

cfonts.say('Node.js|sandbox!', {
  font: 'block', // define the font face
  align: 'left', // define text alignment
  colors: ['system'], // define all colors
  background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
  letterSpacing: 1, // define letter spacing
  lineHeight: 1, // define the line height
  space: true, // define if the output text should have empty lines on top and on the bottom
  maxLength: '0', // define how many character can be on one line
  gradient: 'red,blue', // define your two gradient colors
  independentGradient: false, // define if you want to recalculate the gradient for each new line
  transitionGradient: true, // define if this is a transition between colors directly
  env: 'node' // define the environment cfonts is being executed in
})

function printWelcomeMessage() {
  console.log('Welcome, dear human.')
  console.log('')
  console.log('This is a Node.js contained-hosted environment to be used for testing purposes')
  console.log('\u001b[41;1mAttention: this is not a secured sandbox\u001b[0m.')
  console.log('')
  console.log('Hack away!')
  console.log('')
}

async function init() {
  const dockerExecutableName: string = 'docker'

  const sandboxOptions = parseCliArgs()

  try {
    await doesDockerExist(dockerExecutableName)
  } catch (error) {
    console.log('error: unable to detect Docker in path. Is it installed?')
    process.exit(1)
  }

  try {
    await isDockerRunning(dockerExecutableName)
  } catch (error) {
    console.log('error: unable to query the Docker daemon. Is it running?')
    process.exit(1)
  }

  try {
    await isDockerImageAvailable(dockerExecutableName, 'node:18-bullseye-slim')
  } catch (error) {
    console.log(
      'error: unable to find a local copy of the Node.js container image. Have you pulled it?'
    )
    process.exit(1)
  }

  printWelcomeMessage()
  main({ image: sandboxOptions.image, resumable: sandboxOptions.resumable })
}

function parseCliArgs() {
  const cliArguments = parser(process.argv.slice(2), {
    string: ['image'],
    boolean: ['resumable']
  })
  return cliArguments
}

init()
