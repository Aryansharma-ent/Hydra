import express from 'express'
import { runTestCapture, rerunTestCapture, deleteTestRun } from '../Controllers/TestRunControllers'
import { askHydraChat, getTestRunById } from '../Controllers/ProjectControllers'
import { protectApiKey, protect } from "../Middlewares/AuthMiddleware";

const route = express.Router()

route.get('/run/:runId', getTestRunById)
route.delete('/run/:runId', protect, deleteTestRun)
route.post('/test-capture', protectApiKey, runTestCapture)
route.post('/run/:runId/rerun', protect, rerunTestCapture) 
route.post('/run/:runId/chat', protect, askHydraChat)

export default route