const express = require('express');
const next = require('next');
const spawn = require("child_process").spawn;


const app = next({dev : true});
const handle = app.getRequestHandler();

app.prepare().then(()=>{
    const server = express();
    server.use(express.json());

    server.post("/search", (req, res) => {
        console.log(req.body);


    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(8080, () => {
        console.log("Listening on 8080")
    })
});

