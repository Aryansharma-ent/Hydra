import { Request,Response } from "express";
import AsyncHandler from 'express-async-handler'
import mongoose from "mongoose";
import { uploadScreenshot } from "../services/storage";
import  captureScreenshot  from '../services/photographer'; 
import  CompareScreenshots  from '../services/spotter';
import TestRun from "../models/TestRun";
import fs from 'fs'
import path from "path";
import Project from "../models/Project";
import { genAiFixSuggestion } from "../services/consultant";
import User from "../models/User";


/* @desc : POST request to send StagingURL and ProductionURL to the server
   @route : POST /api/test-capture
   @access : Public 
*/

const runBackgroundCapture = async (
  dbRecordId: string,
  stagingUrl: string,
  productionUrl: string,
  testRunId: string,
  stagingBase64?: string,
  productionBase64?: string
) => {
  try {
    let stagingBuffer: { buffer: Buffer; layout: any[] };
    let productionBuffer: { buffer: Buffer; layout: any[] };

    if (stagingBase64 && productionBase64) {
      console.log(`⚡ Processing client-side captured screenshots for DB: ${dbRecordId}`);
      stagingBuffer = { buffer: Buffer.from(stagingBase64, 'base64'), layout: [] };
      productionBuffer = { buffer: Buffer.from(productionBase64, 'base64'), layout: [] };
    } else {
      stagingBuffer = await captureScreenshot(stagingUrl);
      productionBuffer = await captureScreenshot(productionUrl);
    }

    // 4. Compare screenshots and get pixel regressions (Spotter service)
    const compareResult = CompareScreenshots(
        stagingBuffer.buffer,
      productionBuffer.buffer,
      stagingBuffer.layout
    );

              // 3. Stream all 3 RAM buffers directly to ImageKit CDN in parallel!
    const [stagingCdnUrl, productionCdnUrl, diffCdnUrl] = await Promise.all([
      uploadScreenshot(`${testRunId}_staging.png`, stagingBuffer.buffer),
      uploadScreenshot(`${testRunId}_production.png`, productionBuffer.buffer),
      uploadScreenshot(`${testRunId}_diff.png`, compareResult.diffBuffer),
    ]);

    // 5. Query Gemini AI for CSS suggestions (Consultant service) - capped at first 5 to protect quota
    const visualBugsWithAi = [];
    for (let i = 0; i < compareResult.visualBugs.length; i++) {
      const bug = compareResult.visualBugs[i];
      let aiSuggestion;
      
      if (i < 5) {
        aiSuggestion = await genAiFixSuggestion(bug.element, bug.outerHtml, bug.description);
      }
      
      visualBugsWithAi.push({
        element: bug.element,
        description: bug.description,
        location: bug.location,
        aiSuggestion
      });
    }

    // 6. Update the MongoDB document with the finished results!
    await TestRun.findByIdAndUpdate(dbRecordId, {
     status: compareResult.mismatchPercentage > 0 ? 'FAILED' : 'PASSED',
      mismatchPixelsCount: compareResult.mismatchPixels,
      mismatchPercentage: compareResult.mismatchPercentage,
      totalPixelsCompared: compareResult.totalPixels,
      stagingScreenshotUrl: stagingCdnUrl,
      productionScreenshotUrl: productionCdnUrl,
      diffScreenshotUrl: diffCdnUrl,
      visualBugs: visualBugsWithAi
    });

   console.log(`☁️ Pure Cloud Comparison finished with 0 disk writes for DB: ${dbRecordId}`);

  } catch (error) {
    console.error(` Error during background capture for DB: ${dbRecordId}`, error);
    
    // Fail-safe: Update status to FAILED in the DB so the frontend knows the process stopped
    await TestRun.findByIdAndUpdate(dbRecordId, {
      status: 'FAILED',
      mismatchPercentage: 100,
      totalPixelsCompared: 0,
      mismatchPixelsCount: 0,
      visualBugs: []
    }).catch(dbErr => console.error("Failed to save error status to database:", dbErr));
  }
};




 export const runTestCapture = AsyncHandler(async(req : Request,res : Response): Promise<void> => {
     let {stagingUrl,productionUrl,projectId,stagingBase64,productionBase64} = req.body


    const authProject = (req as any).project
    if(authProject){
      projectId = authProject._id
      if(!stagingUrl) stagingUrl = authProject.stagingUrl
      if(!productionUrl) productionUrl = authProject.productionUrl
    }


     // If called from frontend, load the project details by ID to get the default URLs
     let project;
     if (projectId) {
         project = await Project.findById(projectId);
     }
     if (project) {
         if (!stagingUrl) stagingUrl = project.stagingUrl;
         if (!productionUrl) productionUrl = project.productionUrl;
     }


     if(!stagingUrl || !productionUrl){
        res.status(400)
        throw new Error("Missing stagingUrl or productionUrl. Please supply both in the request body.")
     }

      console.log(` Hydra AI: Dispatched visual comparison scan...`);
      console.log(`   Staging:    ${stagingUrl}`);
      console.log(`   Production: ${productionUrl}`);
     
 
  if (!project) {
    project = await Project.findOne({ name: 'Default Demo Project' });
  }
  if (!project) {
    project = await Project.create({
      name: "Default Demo Project",
      stagingUrl,
      productionUrl
    });
  }
  const owner = await User.findById(project.owner);
  // 2. Generate random testrunid for file naming
  const testRunId = `run_${Math.random().toString(36).substring(2, 11)}`;
  const stagingFilename = `${testRunId}_staging.png`;
  const productionFilename = `${testRunId}_production.png`;
  const diffFilename = `${testRunId}_diff.png`;
  // 3. Create the initial TestRun database entry with status 'RUNNING' and placeholder metrics
  const testRun = await TestRun.create({
    projectId: project._id as mongoose.Types.ObjectId,
    status: 'RUNNING',
    mismatchPixelsCount: 0,
    mismatchPercentage: 0,
    totalPixelsCompared: 0,
    stagingUrl,        
    productionUrl,
    stagingScreenshotUrl: `/screenshots/${stagingFilename}`,
    productionScreenshotUrl: `/screenshots/${productionFilename}`,
    diffScreenshotUrl: `/screenshots/${diffFilename}`,
    visualBugs: []
  });
  // 4. Return instant 200 response so frontend displays the pulsing 'RUNNING' card immediately
 
res.status(200).json({
  success: true,
  message: "Visual regression comparison completed successfully",
  data: {
    ...testRun.toObject(),
    isPro: owner?.tier === 'PRO',
  }
});


     runBackgroundCapture(
     (testRun._id as mongoose.Types.ObjectId).toString(),
     stagingUrl,
     productionUrl,
     testRunId,
     stagingBase64,
     productionBase64
   );
  

  })






 export const rerunTestCapture = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { runId } = req.params;

  // 1. Find the existing test run
  const testRun = await TestRun.findById(runId);
  if (!testRun) {
    res.status(404);
    throw new Error("Test run not found");
  }

  let stagingUrl = testRun.stagingUrl;
  let productionUrl = testRun.productionUrl;

  // 2. Resolve the parent project to fetch staging & production URLs
  const project = await Project.findById(testRun.projectId);
  if(!stagingUrl || !productionUrl){

    if (!project) {
      res.status(404);
      throw new Error("Linked project details not found");
    }
    stagingUrl = project.stagingUrl;
    productionUrl = project.productionUrl;
  }

  // 3. Reset the document status in MongoDB back to 'RUNNING' and clear old statistics
  testRun.status = 'RUNNING';
  testRun.visualBugs = [];
  testRun.mismatchPercentage = 0;
  testRun.mismatchPixelsCount = 0;
  testRun.totalPixelsCompared = 0;
  testRun.stagingUrl = stagingUrl,
  testRun.productionUrl = productionUrl,
  await testRun.save();

  // 4. Return instant response so the frontend shows the loader instantly
  res.status(200).json({
    success: true,
    message: "Visual comparison scan restarted successfully in background",
    data: testRun
  });

  // 5. Extract the existing screenshot filename prefix (e.g. from "/screenshots/run_v0doyrnly_staging.png")
  // so we overwrite the exact same files on disk
  const filename = path.basename(testRun.stagingScreenshotUrl); // e.g. "run_v0doyrnly_staging.png"
  const testRunId = filename.replace('_staging.png', ''); // e.g. "run_v0doyrnly"

  // 6. Spawn the background capture process using the same URLs and file prefix
  runBackgroundCapture(
    testRun._id.toString(),
    stagingUrl,
    productionUrl,
    testRunId
  );
});

export const deleteTestRun = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { runId } = req.params;
  const testRun = await TestRun.findById(runId);

  if (!testRun) {
    res.status(404);
    throw new Error("Test run not found");
  }

  await TestRun.findByIdAndDelete(runId);

  res.status(200).json({
    success: true,
    message: "Test run deleted successfully"
  });
});