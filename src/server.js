const app = require("./app");
const connectDatabase = require("./config/db");
const { serverPort, mongodbURL } = require("./secret");



app.listen(serverPort, '0.0.0.0', async (req, res)=> {
    console.log(`server is running http://localhost:${serverPort}`);
    await connectDatabase();
});