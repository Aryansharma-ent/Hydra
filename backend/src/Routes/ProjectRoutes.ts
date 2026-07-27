import { getProjects, getProjectRuns, createProject, generateApikey, updateProject } from "../Controllers/ProjectControllers";
import express from 'express';
import { protect } from "../Middlewares/AuthMiddleware";

const route = express.Router();

// All project management endpoints require a logged-in user
route.use(protect);

route.get('/', getProjects);
route.post('/', createProject);
route.put('/:id', updateProject);
route.get('/:projectId/runs', getProjectRuns);
route.post('/:id/generate-key', generateApikey);

export default route;