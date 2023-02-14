#!/usr/bin/env node

import cfonts from 'cfonts'
import { main } from '../main'

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

console.log('Welcome, dear human.')
console.log('')
console.log('This is a Node.js contained-hosted environment.')
console.log('It is meant to be used for testing in isolation purposes')
console.log('however, note that it is not a bullet-proof secured sandbox.')

main()
