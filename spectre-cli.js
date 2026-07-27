#!/usr/bin/env node
const { rejects } = require('assert')
const http = require('http')
const fs = require('fs')
const path = require('path')
let localtunnel;
try {
    localtunnel = require('localtunnel');
} catch (e) {
    localtunnel = null;
}
const { execSync } = require('child_process');

//why using http? because if we used express or axios the server will not be fast because of axios installation so we are using manual methods

// helper to parse CLI arguments manually (avoiding third-party packages)


// process.argv looks like this:
// ['node', 'spectre-cli.js', '--project', '123', '--key', 'abc']

function parseArgs() {
    const args = process.argv.slice(2)

    const params = {}

    for (let i = 0; i < args.length; i++) {
       if(args[i].startsWith('--')){
        const key = args[i].slice(2)
        const val = args[i + 1]
        if(val && !val.startsWith('--')){
            params[key] = val;
            i++;
        } else{
            params[key] = true
        }
       }
        
    }

    return params
}


async function handleLocalhostTunnel(urlStr, forceTunnel = false) {
    if (!urlStr || !localtunnel || !forceTunnel) return { url: urlStr, close: () => {} };

    try {
        const parsed = new URL(urlStr);
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
            const port = parseInt(parsed.port) || 3000;
            console.log(`\n\x1b[36m🔗 Localhost URL detected (${urlStr}). Exposing port ${port} via secure tunnel...\x1b[0m`);

            const tunnel = await localtunnel({ port });
            console.log(`\x1b[32m⚡ Temporary tunnel active: ${tunnel.url}\x1b[0m`);

            return {
                url: tunnel.url,
                close: () => {
                    console.log(`\x1b[90m🔒 Closing local tunnel...\x1b[0m`);
                    tunnel.close();
                }
            };
        }
    } catch (error) {
        console.log("Invalid URL");
    }

    return { url: urlStr, close: () => {} };
}


/*
Start in folder
      │
      ▼
Read all entries
      │
      ▼
For each entry
      │
      ├── Is it node_modules/dist/.git/build?
      │          │
      │          └── Yes → Skip
      │
      ├── Is it a directory?
      │          │
      │          └── Yes → Search inside it (recursive call)
      │
      └── Is it a file?
                 │
                 ▼
      Does filename match the extension regex?
                 │
         No ─────────► Ignore
                 │
                Yes
                 │
                 ▼
         Read file contents
                 │
                 ▼
      Does it contain the search string?
                 │
         No ─────────► Ignore
                 │
                Yes
                 │
                 ▼
         Add its path to `fileList`
*/

// Helper: Search local workspace files for failing CSS selectors/classes
// workflow is written above in the flowchar for this helper function

function findFilesMatching(dir,extensionRegex,searchString,fileList = []){
    const files = fs.readdirSync(dir)
    for(const file of files){
        if(file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;

        const filePath = path.join(dir,file);
        const stat = fs.statSync(filePath);
        if(stat.isDirectory()){
            findFilesMatching(filePath,extensionRegex,searchString,fileList)
            }
            else if(extensionRegex.test(file)){
                try {
                    const content = fs.readFileSync(filePath,'utf-8');
                    if(content.includes(searchString)){
                        fileList.push(filePath)
                    }
                } catch (error) {}
            }
            }

            return fileList;
}

// Subagent Routine: Safe Auto-Healing Code Engine
// mainly goes inside the codebase and make changes 

async function autoHealLayout(visualBugs) {
    console.log(`\n\x1b[35m Hydra Pro Active: Launching Auto-Healing Subagent...\x1b[0m`);
    let healedCount = 0;

    // IMPORTANT branch protection to avoid any pushing into the main branch so that it doesn't changes the main code and asks for review and merging
    try {
        const currentBranch = execSync('git branch --show-current',{ encoding : 'utf-8'}).trim();
        // this produces buffer which kinda looks gibberish so we will encode that vis utf   example : "main\n".trim() = "main"
          if (currentBranch === 'main' || currentBranch === 'master') {
            console.log(`\x1b[33m Branch protection active: Switching from '${currentBranch}' to candidate branch 'hydra-fix/layout-regressions'...\x1b[0m`);
            try {
                   execSync('git checkout -b hydra-fix/layout-regressions', { stdio: 'ignore' });
            } catch (e) {
                execSync('git checkout hydra-fix/layout-regressions', { stdio: 'ignore' });
            }
    } 
}catch (gitErr) {
        console.log("Git not initialized or CLI not in a git repo")
    }

    // Looping through visual Bugs and apply tailwind fixes to component files

    for(const bug of visualBugs){
        if(!bug.element || !bug.aiSuggestion) continue;

        // selector (e.g. "button.submit-btn" -> "submit-btn")

        const selectorClean = bug.element.replace(/^[a-z0-9]+[.#]/i, '').replace(/^[.#]/, '');
           if (!selectorClean) continue;

            console.log(`\n Searching workspace for component file matching "${selectorClean}"...`);
             const matchingFiles = findFilesMatching(process.cwd(), /\.(tsx|jsx|ts|js|css|scss|html)$/, selectorClean);

               if (matchingFiles.length > 0) {
            const targetFile = matchingFiles[0];
            const relativePath = path.relative(process.cwd(), targetFile);
            console.log(`🎯 Found target layout file: \x1b[36m${relativePath}\x1b[0m`);

           try {
                let content = fs.readFileSync(targetFile, 'utf-8');
                // Option B: Perform Tailwind Class Swap directly inside JSX/TSX component
                if (bug.aiSuggestion && bug.aiSuggestion.includes('->')) {
                    const [oldClass, newClass] = bug.aiSuggestion.split('->').map(s => s.trim());
                    if (content.includes(oldClass)) {
                        content = content.replace(oldClass, newClass);
                        console.log(`\x1b[32m✔ Option B Tailwind Swap: Replaced '${oldClass}' with '${newClass}' in ${relativePath}\x1b[0m`);
                    } else {
                        content = `/* Hydra AI Fix: ${bug.aiSuggestion} */\n` + content;
                    }
                } else {
                    // Fallback CSS patch comment
                    content = `/* Hydra AI Fix: ${bug.aiSuggestion} */\n` + content;
                }
                fs.writeFileSync(targetFile, content, 'utf-8');
                console.log(`\x1b[32m✔ Auto-Healed layout bug on <${bug.element}> in ${relativePath}\x1b[0m`);
                healedCount++;
                // Commit patch to candidate branch
                try {
                    execSync(`git commit -am "style(hydra): auto-heal visual regression on ${bug.element}"`, { stdio: 'ignore' });
                    console.log(`\x1b[90m  └─ Committed patch to candidate branch.\x1b[0m`);
                } catch (gitErr) {}
            } catch (err) {
                console.error(`❌ Failed to apply patch to ${relativePath}: ${err.message}`);
            }
        } else {
            console.log(` Could not find source file containing "${selectorClean}". Skipping auto-heal for this element.`);
        }
    }
    if (healedCount > 0) {
        console.log(`\n\x1b[32m Auto-Healing Complete! ${healedCount} layout patch(es) applied and committed to candidate branch.\x1b[0m\n`);
    } else {
        console.log(`\n\x1b[33m Auto-Healing finished. No direct layout patches could be safely mapped.\x1b[0m\n`);
    }
}

const params = parseArgs()
const projectId = params.project || params.projectId
const apiKey = params.key || params.apiKey
const stagingUrl = params.stagingUrl
const productionUrl = params.productionUrl


if (!projectId || !apiKey) {
    console.error("\x1b[31m❌ Error: Missing required arguments.\x1b[0m");
    console.log("\nUsage:");
    console.log("  node spectre-cli.js --project <projectId> --key <apiKey> [--stagingUrl <url>] [--productionUrl <url>]\n");
    console.log("Options:");
    console.log("  --project, --projectId   The ID of your project target");
    console.log("  --key, --apiKey          The secure API key generated for the project");
    console.log("  --stagingUrl             (Optional) Override staging URL for dynamic PR branch tests");
    console.log("  --productionUrl          (Optional) Override production benchmark URL");
    process.exit(1);
}

//POST request using Node's built-in http module

function postJson(url,headers,body){
    return new Promise((resolve,reject)=>{
        const u = new URL(url)
        const options = {
            hostname : u.hostname,
            port : u.port || 80,
            path : u.pathname,
            method : 'POST',
            headers : {
                 'Content-Type' : 'application/json',
                 ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = ''
            res.on('data',chunk => data += chunk)
            res.on('end', ()=>{
                try {
                    const parsed = JSON.parse(data);
                    if(res.statusCode >= 400){
                        reject(new Error(parsed.message || `HTTP ${res.statusCode}`))
                    }else{
                        resolve(parsed)
                    }
                } catch (e) {
                    reject(new Error(`failed to parse response ${data} `))
                }
            });
        });
        req.on('error',reject);
        req.write(JSON.stringify(body))
        req.end();
    })
}


function getJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        }).on('error', reject);
    });
}



async function run() {
    const baseUrl = 'http://localhost:8000';
    console.log(`\n\x1b[36m Hydra AI: Triggering visual regression test...\x1b[0m`);
    console.log(`   Project ID: ${projectId}`);

    // Expose localhost staging URL if needed (pass --tunnel to trigger remote localtunnel)
    const forceTunnel = Boolean(params.tunnel || params.useTunnel);
    const stagingTunnel = await handleLocalhostTunnel(stagingUrl, forceTunnel);
    const activeStagingUrl = stagingTunnel.url;

    let runId;
    try {
        const payload = { projectId };
        if (activeStagingUrl) payload.stagingUrl = activeStagingUrl;
        if (productionUrl) payload.productionUrl = productionUrl;

        // Trigger the background Puppeteer scan
        const triggerRes = await postJson(`${baseUrl}/api/tests/test-capture`, {
            'x-api-key': apiKey
        }, payload);

        if (!triggerRes.success || !triggerRes.data) {
            throw new Error(triggerRes.message || "Failed to trigger scan");
        }

        const runData = triggerRes.data;
        runId = runData._id;
        console.log(`\n\x1b[33m Scan Dispatched Run ID: ${runId}\x1b[0m`);
        console.log(`   Staging:    ${runData.stagingUrl}`);
        console.log(`   Production: ${runData.productionUrl}`);
        console.log(`\nPolling for results...`);
    } catch (err) {
        stagingTunnel.close();
        console.error(`\x1b[31m❌ Trigger failed: ${err.message}\x1b[0m\n`);
        process.exit(1);
    }

    // poll the test run status until it completes
    const pollInterval = 3000; // 3 seconds
    let dots = '';

    const interval = setInterval(async () => {
        try {
            dots = dots.length >= 3 ? '' : dots + '.';

            process.stdout.write(`\rAnalyzing layout differences${dots.padEnd(3)} `);

            const statusRes = await getJson(`${baseUrl}/api/tests/run/${runId}`);

            if (!statusRes.success || !statusRes.data) {
                throw new Error("Failed to fetch run status");
            }
            const run = statusRes.data;
            if (run.status === 'RUNNING') {
                return; // keep waiting
            }

            // test finished — stop interval loop & close tunnel
            clearInterval(interval);
            process.stdout.write('\r\x1b[K'); // clear line
            stagingTunnel.close();

            if (run.status === 'PASSED') {
                console.log(`\n\x1b[32m✔ Visual Regression Test PASSED!\x1b[0m`);
                console.log(`   Mismatch Percentage: ${run.mismatchPercentage.toFixed(2)}%`);
                console.log(`   No layout drifts detected.`);
                console.log(`\n   View report: http://localhost:5173/runs/${runId}?projectId=${projectId}`);
                process.exit(0);
            } else if (run.status === 'FAILED') {
                console.error(`\n\x1b[31m❌ Visual Regression Test FAILED\x1b[0m`);
                console.error(`   Mismatch: ${run.mismatchPercentage.toFixed(2)}% (${run.mismatchPixelsCount} pixels mismatched)`);
                console.error(`   Detected Bugs: ${run.visualBugs?.length || 0}`);
                
                if (run.visualBugs && run.visualBugs.length > 0) {
                    console.log(`\nIdentified layout drift issues:`);
                    run.visualBugs.forEach((bug, idx) => {
                        console.log(`   ${idx + 1}. Selector: "${bug.element}" -> ${bug.description}`);
                    });
                }
                console.log(`\n View report: http://localhost:5173/runs/${runId}?projectId=${projectId}\n`);

                // checki g pro tier flag for Auto-Healing Subagent
                if (run.isPro) {
                      await autoHealLayout(run.visualBugs || []);
                } else {
                    console.log(`\x1b[33m💡 Upgrade to Hydra Pro to automatically repair layout regressions in CI.\x1b[0m\n`);
                }

                process.exit(1);
            }
        } catch (err) {
            clearInterval(interval);
            stagingTunnel.close();
            console.error(`\n\x1b[31m❌ Polling error: ${err.message}\x1b[0m\n`);
            process.exit(1);
        }
    }, pollInterval);
}

run();
