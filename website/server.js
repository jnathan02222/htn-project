const express = require('express');
const next = require('next');
const { spawn } = require('node:child_process');

const app = next({dev : true});
const handle = app.getRequestHandler();
const webscraperFilePath = "c:/Coding_Projects/htn-project/webscraper/webscraper.py";

app.prepare().then(()=>{
    const server = express();
    server.use(express.json());

    server.post("/search", (req, res) => {
        const python = spawn('python', [webscraperFilePath, req.body.website, 100]);

        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        }); 
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(8080, () => {
        console.log("Listening on 8080")
    })
});

