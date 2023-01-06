const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "workflows",
    password: "postgrey",
    port: 5432
})


const cron = require("node-cron")
let nodeProgress = true
let selectedCategory = ""
let userMobileNumber = ""
let taskArr = []
var messageQue = []
var task
let timeCounter = 0
let step = 0


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
    const { idx, nodes, edges, workflowname } = request.body
    //take workflow id as 28

    let idxWorkflow
    let userStatus = ""
    userMobileNumber = ""
    // selectedCategory = ""
    let userinfo = []
    let nodesOrder = getNodesOrder(nodes, edges)
    let username = ""
    // check if the user is present in the table

    if (taskArr.length > 0) {
        task.stop()
    }
    timeCounter = 0;


    task = cron.schedule("*/6 * * * * *", async () => {

        // console.log("running cron every 6 second", nodeProgress)

        console.log("timeCounter : ", timeCounter, nodeProgress, idxWorkflow)
        if (messageQue.length > 0) {
            username = messageQue[0].username
            timeCounter += 6

            if (timeCounter >= 60 || idxWorkflow === 13) {
                terminateWorkflowStatusByUsernameIdx(username, idxWorkflow)
            }

            if (nodeProgress === true) {
                // console.log("inside activated", nodeProgress)
                timeCounter = 0
                activateWorkflowStatus(username, idxWorkflow)
            }

            let query = "select * from userinfo where username =" + "'" + username + "'"
            pool.query(query, (err, results) => {
                if (err) {
                    throw err
                } else {
                    userinfo = results.rows
                    if (userinfo.length === 0) {
                        userStatus = "new"
                        idxWorkflow = 1
                        nodeProgress = true
                        // console.log("inserted new value", messageQue[0].payload);
                        let workflow = JSON.stringify({ flowId: 28, idx })
                        insertNewUser(username, workflow)
                        let args = { username, workflowId: "28", status: "active", idx }
                        insertWorkflowStatus(args)
                    } else if (userinfo.length > 0) {

                        idxWorkflow = userinfo[0].workflows.idx
                        // console.log("idxworkflow set", idxWorkflow)
                        nodeProgress = true
                        userMobileNumber = userinfo[0].usermobilenumber
                        selectedCategory = userinfo[0].selectedcategory
                        if (userMobileNumber !== null || userMobileNumber !== "") {
                            userStatus = "old"
                        }
                    }
                }
            })
            for (idxWorkflow; idxWorkflow <= nodesOrder.length; nodeProgress ? idxWorkflow++ : idxWorkflow) {
                await sleep(2000)
                step = idxWorkflow
                let workflow = JSON.stringify({ flowId: 28, idx: idxWorkflow })
                updateUser(username, workflow)
                updateWorkflowStatus(username, "28", idxWorkflow)
                if (idxWorkflow === 1) {
                    console.log(username, "api started")
                } else if (idxWorkflow === 2) {
                    console.log(username, "condition started")
                    console.log(username, "checking user status")

                    // wait for user status api
                } else if (idxWorkflow === 3) {
                    // api failed

                } else if (idxWorkflow === 4) {
                    // new user text node
                    if (userStatus === "new") {
                        console.log(username, "Welcome to our platform 😃")
                        nodeProgress = true
                    }
                } else if (idxWorkflow === 5) {
                    // existing user text node
                    if (userStatus === 'old') {
                        console.log(username, 'Welcome to our platform')
                        nodeProgress = true
                    }
                } else if (idxWorkflow === 6) {
                    console.log("inside step 6", messageQue[0]);
                    // ask for phone number
                    // let message = validatePhonenumber(messageQue[0].payload)
                    if (userMobileNumber === "" || userMobileNumber === null) {
                        nodeProgress = false
                        if (timeCounter % 30 === 0 && timeCounter <= 60) {
                            console.log(username, "Please provide phone number...")
                        }
                    }
                    else {
                        nodeProgress = true
                    }

                    // wait for customer
                } else if (idxWorkflow === 7) {
                    // send category template

                    if (selectedCategory === "" || selectedCategory === null) {
                        if (timeCounter % 30 === 0 && timeCounter <= 60) {
                            console.log(username, "Please choose either vegetable , medicine or groceries")
                        }
                        nodeProgress = false
                    } else {
                        nodeProgress = true
                    }

                    // wait for customer to click
                } else if (idxWorkflow === 8) {
                    // condition check for customer click 
                    console.log(selectedCategory);
                    if (selectedCategory === "vegetable") {
                        console.log(username, "Vegetable list : \n 1. Potato \n 2. Tomato \n 3. Onion")
                        nodeProgress = true
                    } else if (selectedCategory === "medicine") {
                        console.log(username, "Medicine list : \n 1. Paracetamol \n 2. Serodon \n 3. Disprin")
                        nodeProgress = true
                    } else if (selectedCategory === "groceries") {
                        console.log(username, "Groceries list : \n 1. Cereal \n 2.Sugar \n 3. Rice")
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

                    nodeProgress = true
                    console.log(username, "Thanks for shopping with us")
                    workflow = JSON.stringify({ flowId: "28", idx: "1" })
                    updateUser(username, workflow)
                    updateWorkflowStatus(username, "28", "1")
                    updateCategory(username)
                    // messageQue.pop()
                }
            }
        }
    })

    taskArr.push(task)
    console.log("idxWorkflow", idxWorkflow);

    response.json({ message: "Workflow started" })
}

const takeUserInput = (request, response) => {
    const { username, payload } = request.body
    timeCounter = 0
    console.log("step", step)
    if (messageQue.length > 0) {
        messageQue.pop()
    }
    activateWorkflowStatus(username)

    messageQue.push({ username, payload })

    if (step === 6) {
        if (validatePhonenumber(payload) === true) {
            insertMobileNumber(payload, username)
            nodeProgress = true
        } else {
            console.log("Please provide valid number")
        }
    }
    if (step === 7) {
        if (validateCategory(payload) === true) {
            insertCategory(payload, username)
            nodeProgress = true
        } else {
            console.log("Please provide a valid category name")
        }
    }

    response.json({ msg: "message received" })
}

const validatePhonenumber = (number) => {
    if (number.length === 10 && isNaN(+number) === false) {
        nodeProgress = true
        // return "Phone number set"
        return true
    }
    return false
    // return "Please provide valid number"
}

const validateCategory = (category) => {
    if (category === "vegetable" || category === "medicine" || category === "groceries") {
        return true
    }
    return false
}

const insertWorkflowStatus = (args) => {
    let timestamp = Date()
    let { username, workflowId, status, idx } = args
    let query = "insert into workflowstatus (username,workflowid,status,idx,timestamp) values ($1,$2,$3,$4,$5)"
    pool.query(query, [username, workflowId, status, idx, timestamp], (err, results) => {
        if (err) {
            throw err
        }
    })
}

const updateWorkflowStatus = (username, workflowId, idx) => {
    let query = "update workflowstatus set idx =" + "'" + idx + "'" + "where username=" + "'" + username + "'" + "and workflowid=" + "'" + workflowId + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
    })
}

const terminateWorkflowStatusByUsernameIdx = (username, idx) => {
    let query = "update workflowstatus set status='terminated' where username=" + "'" + username + "'" + "and idx =" + "'" + idx + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
    })

}

const updateCategory = (username) => {
    let query = "update userinfo set selectedcategory = null where username=" + "'" + username + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
    })
}

const activateWorkflowStatus = (username, idx) => {
    timeCounter = 0
    let query = ""
    if (idx) {
        query = "update workflowstatus set status='active' where username=" + "'" + username + "'" + "and idx =" + "'" + idx + "'"
    } else {
        query = "update workflowstatus set status='active' where username=" + "'" + username + "'"
    }
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
    })
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

const updateUser = (username, workflow) => {
    let query = "UPDATE userinfo SET workflows =" + "'" + workflow + "'" + "WHERE username =" + "'" + username + "'"
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
        }
    })
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
    const { id } = request.body
    terminateWorkflowById(id)
    if (task) {
        task.stop()
    }
    response.json({ msg: "workflow stopped" })
}

const terminateWorkflowById = (id) => {
    let query = "update workflowstatus set status='terminated' where id=" + "'" + id + "'"
    pool.query(query, (err, results) => {
        if (err) {
            throw err
        }
    })
}

module.exports = {
    getAllWorkflows, addWorkflow, getWorkflowById, runWorkflowByOrder
    , abortWorkflow, takeUserInput
}