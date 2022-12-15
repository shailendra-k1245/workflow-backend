const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "workflows",
    password: "postgrey",
    port: 5432
})


const StateMachine = require("javascript-state-machine")
const cron = require("node-cron")
const key = "e5b78779c53ded533dbd9023f6c74286"
const axios = require("axios")
let currentState = ""
let nodeProgress = true
let idxWorkflow = 1

let userStatus = "new"
let phoneNumber = ""
let customerCategory = ""

// const token = ""

let userInfo = []


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
    let { username, idx, nodes, edges, workflowname } = request.body
    request.session.name = username
    request.session.workflow = workflowname
    request.session.idx = idx

    //

    
    let nodesOrder = getNodesOrder(nodes, edges)

    let userinfo = []
    // check if the user is present in the table
    pool.query(`SELECT * FROM userinfo WHERE username = ${username} `, (err, results) => {
        if (err) {
            // throw err;
            // user not present in the table
            // insert the user
            // console.log(err)
            idxWorkflow = 1

        } else {
            userinfo = results.rows[0];
            idxWorkflow = userinfo.workflows.idx
            nodeProgress = true
        }
    })

    if (userinfo.length === 0) {
        let workflow = JSON.stringify({ nodes, edges, idx })
        pool.query(`INSERT INTO userinfo (username,workflows) values ($1,$2)`, [username, workflow], (err, results) => {
            if (err) {
                console.log(err)
            }
            nodeProgress = true
        })
    }

    cron.schedule("*/10 * * * * *", async () => {
        console.log("running cron every 10 second", nodeProgress, idxWorkflow, userInfo)

        for (idxWorkflow; idxWorkflow < nodesOrder.length; idxWorkflow++) {
            // let workflow = JSON.stringify({ nodes, edges, idx: idxWorkflow })
            // pool.query(`UPDATE userinfo SET workflows = ${workflow} WHERE username = ${username}`, (err, results) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         console.log(results.rows[0])
            //     }
            // })
            await sleep(2000)
            if (idxWorkflow === 1) {
                console.log("api started")
            } else if (idxWorkflow === 2) {
                console.log("condition started")
                console.log("checking user status")
                nodeProgress = false
                // wait for user status api
            } else if (idxWorkflow === 3) {
                // api failed
            } else if (idxWorkflow === 4) {
                // new user text node
                if (userStatus === "new") {
                    console.log('new user')
                    nodeProgress = true
                }
            } else if (idxWorkflow === 5) {
                // existing user text node
                if (userStatus === 'old') {
                    console.log('old user')
                    nodeProgress = true
                }
            } else if (idxWorkflow === 6) {
                // ask for phone number
                if (userStatus === "new") {
                    console.log("please provide phone number...")
                    nodeProgress = false
                } else {
                    nodeProgress = true
                }
                // wait for customer
            } else if (idxWorkflow === 7) {
                // send category 
                console.log("Please chose either vegetable or medicine")
                //give request in small cap
                nodeProgress = false
                // wait for customer to click
            } else if (idxWorkflow === 8) {
                // condition check for customer click 
                nodeProgress = true
                if (customerCategory === "vegetable") {
                    console.log("Vegetable list : \n 1. Potato \n 2. Tomato \n 3. Onion")
                } else if (customerCategory === "medicine") {
                    console.log("Medicine list : \n 1. Paracetamol \n 2. Serodon \n 3. Disprin")
                }
            } else if (idxWorkflow === 9) {
                // template failed
            } else if (idxWorkflow === 10) {
                // send vegetable acc to customer
            } else if (idxWorkflow === 11) {
                // send medicines acc to customer
            } else if (idxWorkflow === 12) {
                // template failed
                console.log("end of workflow")
            }

        }

    })

    response.json({ message: "Engine started" })
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

// const runWorkflowByOrder = (request, response) => {
//     let { nodes, edges } = request.body
//     getNodesOrder(nodes, edges)
// }


const playPauseWorkflow = (request, response) => {
    const action = request.body
    // console.log(action, action.action)
    if (action.action === "play") {
        nodeProgress = true
    } else if (action.action === "pause") {
        nodeProgress = false
    }
    response.send({ data: "action sent" })
}

const setUserStatus = (request, response) => {
    const { user } = request.body
    userStatus = user
    nodeProgress = true
    console.log("user status: ", user)
    response.send({ data: "user set" })
}

const setPhoneNumber = (request, response) => {
    const { number } = request.body
    phoneNumber = number
    // console.log("phone:", phoneNumber)
    if (phoneNumber.length === 10) {
        nodeProgress = true
        console.log("phone number set as:", phoneNumber)
    } else {
        console.log("invalid number ")
    }
    response.send({ data: "number set" })
}

const setCategory = (request, response) => {
    const { category } = request.body
    customerCategory = category
    console.log("category:", category)
    nodeProgress = true
    response.send({ data: "category set" })
}

const getSessionName = (request, response) => {
    let name = request.session.name
    response.json({ name })
}

module.exports = {
    getAllWorkflows, addWorkflow, getWorkflowById, runWorkflowByOrder, playPauseWorkflow, setUserStatus
    , setPhoneNumber, setCategory, getSessionName
}