#!/usr/bin/env node

import { main } from '../main'
import Gradient from 'gradient-string';

import cfonts from 'cfonts';

console.log()
console.log(Gradient('cyan', 'pink')('Hello world!'));
main()
