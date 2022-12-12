const StateMachine = require('javascript-state-machine')
const key = 'e5b78779c53ded533dbd9023f6c74286'
const axios = require('axios')
const { stringify } = require('uuid')
var currentState = ''


var tempWorkflow = new StateMachine({
    init: 'start',
    transitions: [
        { name: "start", from: "" },
        { name: "api", from: "" },
        { name: "success", from: "" },
        { name: "fail", from: "" },
        { name: "decision", from: "" },
        { name: "if", from: "" },
        { name: "else", from: "" },
        { name: 'output', from: "" },
    ],
    methods: {
        onStart: function () { console.log("started") },
        onApi: async function () {
            console.log("Api request made")
            var response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=10&lon=20&appid=${key}`)

            currentState = response.data.main.temp || 'Api failed'
        },
        onDecision: function () {
            console.log("decision started", currentState)
            if (currentState > '284') {
                currentState = 'Summers'
            } else {
                // console.log('Winters');
                currentState = 'Winters'
            }
        },
        onFail: function () {
            console.log("Api failed")
            currentState = 'Error Api failed'
        },
        onOutput: function () {
            console.log("output started")
            console.log("currentState", currentState)
        },
        onEnd: function () {
            console.log("End of workflow")
        }
    }
})






var rainWorkflow = new StateMachine({
    init: 'start',
    transitions: [
        { name: "start", from: "" },
        { name: "api", from: "" },
        { name: "success", from: "" },
        { name: "fail", from: "" },
        { name: "decision", from: "" },
        { name: "if", from: "" },
        { name: "else", from: "" },
        { name: 'output', from: "" },
    ],
    methods: {
        onStart: function () {
            console.log("started")
        },
        onApi: async function () {
            console.log("Api request made")
            var response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=10&lon=20&appid=${key}`)
            currentState = response.data.weather[0].description || "Api failed"
        },
        onDecision: function () {
            console.log("decision started, currentState:", currentState)
            if (currentState.includes("rain")) {
                currentState = "rainy"
            }
        },
        onFail: function () {
            currentState = "Api failed"
            console.log(currentState);
        },
        onOutput: function () {
            console.log("output started");
            console.log("currentState", currentState);
        },
        onEnd: function () {
            console.log("End of workflow");
        }
    }
})

function runTempWorkflow() {
    return tempWorkflow.onApi().then(() => {
        tempWorkflow.onOutput()
    }).then(() => {
        tempWorkflow.onDecision()
    }).then(() => {

        tempWorkflow.onOutput()
    })
        .then(() => {
            tempWorkflow.onEnd()
        })
}

function runRainWorkflow() {
    return rainWorkflow.onApi().then(() => {
        rainWorkflow.onOutput()
    }).then(() => {
        rainWorkflow.onDecision()
    }).then(() => {
        rainWorkflow.onOutput()
    }).then(() => {
        rainWorkflow.onEnd()
    })
}

runTempWorkflow()
// runRainWorkflow()

