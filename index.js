import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import Agent from './d3ql/agent.js'
import routes from './routes.js'

const agentSettings = {
  epsilon: 1, // Exploration rate
  epsilonDecay: 0.00005, // Exploration decay
  epsilonMin: 0.01, // Exploration minimum
  gamma: 0.95, // Discount factor
  tau: 1000, // Update of target network
  memory: {
    batchSize: 64,
    cer: true, // Combined experience replay
    size: 21000
  },
  network: {
    alpha: 0.00025, // Learning rate
    inputSize: 25,
    layers: [
      // Hidden layers
      { activation: 'relu', units: 128 },
      { activation: 'relu', units: 128 }
    ],
    outputSize: 4
  }
}

const app = express()
app.set('agent', new Agent({ settings: agentSettings }))

app.use(cors())
app.use(express.json())
if (app.get('env') === 'development') {
  app.use(
    morgan('dev', {
      skip: (request, response) => response.statusCode === 200
    })
  )
}
app.use('/', routes)
app.use((request, response) => response.sendStatus(404))

const port = 5000
app.listen(port)
console.log(`Agent listening on port ${port}`)
