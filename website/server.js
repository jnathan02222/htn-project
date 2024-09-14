
const express = require('express');
const next = require('next');
const { spawn } = require('node:child_process');
const {WebSocketServer} = require('ws');
var { createServer } = require('http');

const app = next({ dev: true });
const handle = app.getRequestHandler();
const webscraperFilePath = "/Users/cherylz/htn-project/webscraper/webscraper.py";

let linkCount =0;

app.prepare().then(() => {
    const server = express();
    server.use(express.json());
    server.post("/search", (req, res) => {
        const python = spawn('python', [webscraperFilePath, req.body.website, 100]);
        
        let urls = [];
        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            const lines = data.toString().split('\n').filter(line => line.trim() !== '');
            urls = [...urls, ...lines];

            linkCount = urls.length;
            // Broadcast the new link count to all WebSocket clients
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ type: 'linkCount', count: linkCount }));
                }
            });
            res.json({ count: linkCount });
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
    });

});



const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({ type: 'linkCount', count: linkCount }));
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

});

server.listen(8081, () => {
    console.log("Listening on 8081")
});