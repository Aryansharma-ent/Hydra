import { getProjects, getProjectRuns, createProject, generateApikey, updateProject, deleteProject, updateGeminiKey } from "../Controllers/ProjectControllers";
import express from 'express';
import { protect } from "../Middlewares/AuthMiddleware";

const route = express.Router();

// All project management endpoints require a logged-in user
route.use(protect);

route.get('/', getProjects);
route.post('/', createProject);
route.put('/:id', updateProject);
route.delete('/:id', deleteProject);
route.get('/:projectId/runs', getProjectRuns);
route.post('/:id/generate-key', generateApikey);
route.post('/:id/gemini-key', updateGeminiKey);

export default route;