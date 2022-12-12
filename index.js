const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3001;
const db = require("./queries")
const cors = require("cors")

app.use(cors())

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get("/", (req, res) => {
    res.json({ info: "Api working" })
})

app.post("/addWorkflow", db.addWorkflow)
app.get("/allWorkflows", db.getAllWorkflows)

app.post("/runWorkflowByOrder", db.runWorkflowByOrder)
app.post("/playPauseWorkflow", db.playPauseWorkflow)
app.post("/setUserStatus", db.setUserStatus)
app.post("/setPhoneNumber", db.setPhoneNumber)
app.post("/setCategory", db.setCategory)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})