import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Project,{IProject} from "../models/Project";
import User from "../models/User";
import AsyncHandler from 'express-async-handler';
import cache from "../config/cache";

// Middleware 1: Protect CLI endpoints using the Project API Key
export const protectApiKey = AsyncHandler(async(req : Request,res : Response,next : NextFunction)=>{
    const api = req.headers['x-api-key'] as string;

    if(!api){
        res.status(401);
        throw new Error("api key doesn't exist");
    }
    
    const cacheKey = "apikey_" + api;
    let project = cache.get<IProject>(cacheKey);

    if(project){
        console.log("⚡ Cache Hit: API Key found in RAM");
        (req as any).project = project;
        next();
    }else{
        console.log("🐢 Cache Miss: Querying MongoDB for API Key...");
        const fetchedProject = await Project.findOne({apikey : api});

        if(!fetchedProject){
            res.status(401);
            throw new Error("Invalid or unverified API key");
        }

        cache.set(cacheKey, fetchedProject);
        (req as any).project = fetchedProject;
        next();
    }
});

// Middleware 2: Protect Web Dashboard endpoints using JWT
export const protect = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any;

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            (req as any).user = user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token provided");
    }
});