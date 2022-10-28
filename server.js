const http = require("http");
const app = require("./app")
require("./api/db/conn.js")

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port , ()=>{
    console.log(`Server is up and running at port ${port}`);
});