const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3001;
const db = require("./queries")
const cors = require("cors")
const session = require("express-session")



app.use(cors())

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true
}))


app.post("/addWorkflow", db.addWorkflow)
app.get("/allWorkflows", db.getAllWorkflows)

app.post("/runWorkflowByOrder", db.runWorkflowByOrder)
app.post("/takeUserInput", db.takeUserInput)
app.post("/abortWorkflow", db.abortWorkflow)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})