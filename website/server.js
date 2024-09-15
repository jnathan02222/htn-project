
const express = require('express');
const next = require('next');
const { spawn } = require('node:child_process');
const {WebSocketServer} = require('ws');
var { createServer } = require('http');
const cors = require('cors');

const app = next({ dev: true });
const handle = app.getRequestHandler();
const webscraperFilePath = __dirname + "\\..\\webscraper\\webscraper.py";
const modelFilePath = __dirname + "\\..\\sentiment-analysis\\model_executor.py";

app.prepare().then(() => {
    const server = express();
    server.use(express.json());
    server.use(cors());
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
   
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        const info = JSON.parse(data);
        
        const python = spawn('python', [webscraperFilePath, info.website, info.articles]);
        
        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            const lines = data.toString().split('\n').filter(line => line.trim() !== '');
            for(line of lines){
                if(line.includes("PARSED:")){
                    ws.send(JSON.stringify({sentencesParsed : line.replace("PARSED:", "")}))
                }else if(line.includes("SCRAPING:")){
                    ws.send(JSON.stringify({articlesAnalyzed : "1"}))
                }else if(line.includes("MODEL:")){
                    
                    const [header, ticker, value] = line.split(":", 3);
                    ws.send(JSON.stringify({ticker : ticker, value : value.replace("\r", "")}))

                    /*
                    const model = spawn('python', [modelFilePath, sentence]);

                    model.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                        ws.send(JSON.stringify({ticker : ticker, value : data.toString().replace("\r\n", "")}))
                    });
                    model.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });
                    model.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);
                    });*/
                }
            }
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    });

});

server.listen(8081, () => {
    console.log("Listening on 8081")
});