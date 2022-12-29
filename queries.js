const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "workflows",
    password: "postgrey",
    port: 5432
})
const CronJob = require('cron').CronJob;


const StateMachine = require("javascript-state-machine")
const cron = require("node-cron")
const key = "e5b78779c53ded533dbd9023f6c74286"
const axios = require("axios")
let currentState = ""
let nodeProgress = true
let selectedCategory = ""
let userMobileNumber = ""
// let userinfo = []
let taskArr = []
let messageQue = []
let task

let methods = {
    onStart: function () { console.log("Started") }
}

var tempWorkflow = new StateMachine({
    init: "start",
    transitions: [],
    methods
})

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(function () {
        if (nodeProgress === true) {
            resolve()
        }
    }, time))
}

const getWorkflowById = (request, response) => {
    const { id } = request.body
    pool.query(`SELECT * FROM workflows where id = ${id} ORDER BY name ASC`, (err, results) => {
        if (err) {
            // response.status(404).json({ "err": err })
            throw err;
        } else
            response.status(200).json(results.rows[0])
    })
}

const getAllWorkflows = (request, response) => {
    pool.query("SELECT * FROM workflows ORDER BY name ASC", (err, results) => {
        if (err) {
            // response.status(404).json({ "err": err })
            throw err;
        }
        response.status(200).json(results.rows)
    })
}

const addWorkflow = (request, response) => {
    let { id, name, initialEdges, initialNodes, nodesOrder } = request.body
    // id = JSON.stringify(id)
    // name = JSON.stringify(name)
    initialEdges = JSON.stringify(initialEdges)
    initialNodes = JSON.stringify(initialNodes)
    nodesOrder = JSON.stringify(nodesOrder)
    pool.query(
        "INSERT INTO workflows (id,name,initialEdges,initialNodes,nodesOrder) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [id, name, initialEdges, initialNodes, nodesOrder],
        (err, results) => {
            if (err) {
                // response.status(404).json({ "err": err })
                throw err;
            } else
                response.status(201).send(`Workflow added: ${results.rows[0]}`)
        }
    )
}

const runWorkflowByOrder = async (request, response) => {
    const { username, idx, nodes, edges, workflowname } = request.body
    //take workflow id as 28
    let idxWorkflow = 1;
    let userStatus = ""
    userMobileNumber = ""
    selectedCategory = ""
    let userinfo = []
    let nodesOrder = getNodesOrder(nodes, edges)

    // check if the user is present in the table

    let query = "select * from userinfo where username =" + "'" + username + "'"
    await pool.query(query, (err, results) => {
        if (err) {
            idxWorkflow = 1;
            throw err

        } else {
            userinfo = results.rows
            if (userinfo.length === 0) {
                userStatus = "new"
                idxWorkflow = 1
                nodeProgress = true
                console.log("inserted new value");
                let workflow = JSON.stringify({ nodes, edges, idx })
                insertNewUser(username, workflow)
            } else if (userinfo.length > 0) {

                idxWorkflow = userinfo[0].workflows.idx
                nodeProgress = true
                userMobileNumber = userinfo[0].usermobilenumber
                selectedCategory = userinfo[0].selectedcategory
                if (userMobileNumber !== null || userMobileNumber !== "") {
                    userStatus = "old"
                }
            }
        }
    })

    if (taskArr.length > 0) {
        task.stop()
    }

    let timeCounter = 0;

    task = cron.schedule("*/6 * * * * *", async () => {
        console.log("running cron every 6 second", nodeProgress, idxWorkflow, username, userStatus)
        timeCounter += 6

        if (timeCounter % 60 === 0 && idxWorkflow === 6) {
            console.log("Please provide phone number...", username);
        }
        if (timeCounter % 60 === 0 && idxWorkflow === 7) {
            console.log("Please chose either vegetable or medicine", username);
        }

        for (idxWorkflow; idxWorkflow <= nodesOrder.length; nodeProgress ? idxWorkflow++ : idxWorkflow) {
            await sleep(2000)
            let workflow = JSON.stringify({ nodes, edges, idx: idxWorkflow - 1 })
            updateUser(username, workflow)
            if (idxWorkflow === 1) {
                console.log("api started", username)
            } else if (idxWorkflow === 2) {
                console.log("condition started", username)
                console.log("checking user status", username)

                // wait for user status api
            } else if (idxWorkflow === 3) {
                // api failed

            } else if (idxWorkflow === 4) {
                // new user text node
                if (userStatus === "new") {
                    console.log("Welcome to our platform 😃", username)
                    nodeProgress = true
                }
            } else if (idxWorkflow === 5) {
                // existing user text node
                if (userStatus === 'old') {
                    console.log('Welcome back, existing user', username)
                    nodeProgress = true
                }
            } else if (idxWorkflow === 6) {
                // ask for phone number
                if (userMobileNumber === "" || userMobileNumber === null) {
                    console.log("Please provide phone number...", username)
                    nodeProgress = false
                }
                else {
                    nodeProgress = true
                }
                // wait for customer
            } else if (idxWorkflow === 7) {
                // send category 
                if (selectedCategory === "" || selectedCategory === null) {
                    console.log("Please chose either vegetable or medicine", username)
                    nodeProgress = false
                } else {
                    nodeProgress = true
                }

                // wait for customer to click
            } else if (idxWorkflow === 8) {
                // condition check for customer click 
                console.log(selectedCategory);
                if (selectedCategory === "vegetable") {
                    console.log("Vegetable list : \n 1. Potato \n 2. Tomato \n 3. Onion")
                    nodeProgress = true
                } else if (selectedCategory === "medicine") {
                    console.log("Medicine list : \n 1. Paracetamol \n 2. Serodon \n 3. Disprin")
                    nodeProgress = true
                }
            } else if (idxWorkflow === 9) {
                // template failed
                nodeProgress = true
            } else if (idxWorkflow === 10) {
                // send vegetable acc to customer
                nodeProgress = true
            } else if (idxWorkflow === 11) {
                // send medicines acc to customer
                nodeProgress = true
            } else if (idxWorkflow === 12) {
                // template failed
                console.log("end of workflow")
            }

        }

    })

    taskArr.push(task)
    console.log("idxWorkflow", idxWorkflow);

    response.json({ message: "Workflow started" })
}


const getNodesOrder = (n, e) => {
    // console.log(nodes, edges)
    let nodes = n
    let edges = e
    let nodesOrder = []

    for (let i = 0; i < edges.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (edges[i].target === nodes[j].id && !nodes[j].isAdded) {
                const payload = {
                    id: nodes[j].id,
                    type: nodes[j].type,
                    data: nodes[j].data,
                    status: ""
                }
                nodesOrder.push(payload)
                nodes[j].isAdded = true
            }
        }

        if (i === edges.length - 1) {
            for (let k = 0; k < nodes.length; k++) {
                if (edges[i].source === nodes[k].id && !nodes[k].isAdded) {
                    const payload = {
                        id: nodes[k].id,
                        type: nodes[k].type,
                        data: nodes[k].data,
                        status: ""
                    }
                    nodesOrder.push(payload)
                    nodes[k].isAdded = true
                }
            }
        }

    }
    return nodesOrder
}

const insertNewUser = (username, workflow) => {
    pool.query(`INSERT INTO userinfo (username,workflows) values ($1,$2)`, [username, workflow], (err, results) => {
        if (err) {
            console.log(err)
        }
        nodeProgress = true
    })
}

const checkUser = (username) => {
    let query = "select * from userinfo where username =" + "'" + username + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results.rows)
    })
}

const updateUser = (username, workflow) => {
    let query = "UPDATE userinfo SET workflows =" + "'" + workflow + "'" + "WHERE username =" + "'" + username + "'"
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
        }
    })
}

const takeUserInput = (request, response) => {
    const { username, payload } = request.body
    let idx
    let task
    let taskArr = []
    let userResult = []


    messageQue.push({ username, payload })

    if (payload === "vegetable" || payload === "medicine") {
        insertCategory(payload, username)
    } else if (payload.length === 10 && isNaN(+payload) === false) {
        insertMobileNumber(payload, username)
    }

    let query = "select * from userinfo where username =" + "'" + username + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
        userResult = results.rows
        console.log("userresult", userResult)
        if (userResult.length === 0) {
            idx = 1
            let workflow = JSON.stringify({ flowId: "28", idx })
            insertNewUser(username, workflow)
        } else {
            idx = userResult[0].workflows.idx
            console.log("idx", idx)
        }
    })

    if (taskArr.length > 0) {
        task.stop()
    }

    taskArr.push(task)

    task = cron.schedule("*/8 * * * * *", async () => {
        // console.log("running cron every 6 second")

        for (idx; idx <= 13; nodeProgress ? idx++ : idx) {
            await sleep(2000)
            let workflow = JSON.stringify({ flowId: "28", idx: idx - 1 })
            updateUser(username, workflow)
            if (idx === 1) {
                console.log("api started", username)
            } else if (idx === 2) {
                console.log("condition started", username)
                console.log("checking user status", username)

                // wait for user status api
            } else if (idx === 3) {
                // api failed

            } else if (idx === 4) {
                // new user text node
                if (userResult.length === 0) {
                    console.log("Welcome to our platform 😃", username)
                    nodeProgress = true
                }
            } else if (idx === 5) {
                // existing user text node
                if (userResult.length !== 0) {
                    console.log('Welcome back, existing user', username)
                    nodeProgress = true
                }
            } else if (idx === 6) {
                // ask for phone number
                if (userMobileNumber === "" || userMobileNumber === null) {
                    console.log("Please provide phone number...", username)
                    nodeProgress = false
                }
                else {
                    nodeProgress = true
                }
                // wait for customer
            } else if (idx === 7) {
                // send category 
                if (selectedCategory === "" || selectedCategory === null) {
                    console.log("Please chose either vegetable or medicine", username)
                    nodeProgress = false
                } else {
                    nodeProgress = true
                }

                // wait for customer to click
            } else if (idx === 8) {
                // condition check for customer click 
                console.log(selectedCategory);
                if (selectedCategory === "vegetable") {
                    console.log("Vegetable list : \n 1. Potato \n 2. Tomato \n 3. Onion")
                    nodeProgress = true
                } else if (selectedCategory === "medicine") {
                    console.log("Medicine list : \n 1. Paracetamol \n 2. Serodon \n 3. Disprin")
                    nodeProgress = true
                }
            } else if (idx === 9) {
                // template failed
                nodeProgress = true
            } else if (idx === 10) {
                // send vegetable acc to customer
                nodeProgress = true
            } else if (idx === 11) {
                // send medicines acc to customer
                nodeProgress = true
            } else if (idx === 12) {
                // template failed
                console.log("end of workflow")
            }


        }
    })

    messageQue.pop()

    response.json({ msg: "message received" })
}



const insertMobileNumber = (mobileNumber, username) => {
    let query = "UPDATE userinfo SET usermobilenumber =" + "'" + mobileNumber + "'" + "WHERE username =" + "'" + username + "'" + "RETURNING usermobilenumber"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        } else {
            console.log("result mob:", results.rows[0]);
            userMobileNumber = results.rows[0].usermobilenumber
            nodeProgress = true
        }
    })
}

const insertCategory = (category, username) => {
    let query = "UPDATE userinfo SET selectedcategory =" + "'" + category + "'" + "WHERE username =" + "'" + username + "'" + "RETURNING selectedcategory"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        } else {
            console.log("set", results.rows[0])
            selectedCategory = results.rows[0].selectedcategory
            nodeProgress = true
        }
    })
}


const abortWorkflow = (request, response) => {
    task.stop()
    response.json({ msg: "workflow stopped" })
}

module.exports = {
    getAllWorkflows, addWorkflow, getWorkflowById, runWorkflowByOrder
    , abortWorkflow, takeUserInput
}