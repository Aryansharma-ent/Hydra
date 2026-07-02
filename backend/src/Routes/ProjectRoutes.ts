import { getProjects, getProjectRuns, createProject ,generateApikey, updateProject} from "../Controllers/ProjectControllers";
import express from 'express'


const route = express.Router()

route.get('/', getProjects)
route.post('/', createProject)
route.put('/:id', updateProject)
route.get('/:projectId/runs', getProjectRuns)
route.post('/:id/generate-key',generateApikey)  

export default route
