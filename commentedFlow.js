 // for (let i = 0; i < nodesOrder.length; i++) {
    //     nodeProgress = nodesOrder[i].type
    //     if (nodesOrder[i].type === "textNode" && c <= 0) {
    //         c++
    //         // currentState = nodesOrder[i].data
    //         methods.onText = function () {
    //             console.log("text node started", currentState)
    //             var data = JSON.stringify({
    //                 "messaging_product": "whatsapp",
    //                 "recipient_type": "individual",
    //                 "to": "918707349706",
    //                 "type": "text",
    //                 "text": {
    //                     "preview_url": false,
    //                     "body": currentState
    //                 }
    //             });
    //             var config = {
    //                 method: 'post',
    //                 url: 'https://graph.facebook.com/v15.0/113964918201249/messages',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE'
    //                 },
    //                 data: data
    //             };
    //             axios(config)
    //                 .then(function (response) {
    //                     console.log(JSON.stringify(response.data));
    //                 })
    //                 .catch(function (error) {
    //                     console.log(error);
    //                 });
    //         }
    //         tempWorkflow._fsm.config.methods.onText()
    //     } else if (nodesOrder[i].type === "apiNode") {
    //         if (currentState === "product category") {
    //             methods.onApi = async function () {
    //                 var response = await axios.get("https://whatsapp-webhook-kes7.onrender.com/fahad")
    //                 console.log(response.data)
    //                 currentState = response.data[response.data.length - 1].list || "Api failed"
    //                 console.log("Api node started", currentState)
    //             }
    //         } else if (currentState === "") {
    //             methods.onApi = async function () {
    //                 var response = await axios.get("https://whatsapp-webhook-kes7.onrender.com/fahad")
    //                 console.log(response.data)
    //                 currentState = response.data[response.data.length - 1].userStatus || "Api failed"
    //                 console.log("Api node started", currentState)
    //             }
    //         }

    //         await tempWorkflow._fsm.config.methods.onApi()
    //     } else if (nodesOrder[i].type === "conditionNode") {

    //         if (currentState === "vegetable") {
    //             methods.onCondition = function () {
    //                 console.log("decision started", currentState)
    //             }
    //         } else if (currentState === "groceries") {
    //             methods.onCondition = function () {
    //                 console.log("decision started", currentState)
    //             }
    //         } else if (currentState === "new" || "old") {
    //             methods.onCondition = function () {
    //                 console.log("decision started", currentState)
    //                 if (currentState === "new") {
    //                     currentState = 'Welcome to our platform 😃'
    //                 } else if (currentState === "old") {
    //                     // console.log('Winters');
    //                     currentState = 'Existing user 🤝😊'
    //                 } else {
    //                     currentState = "Api failed"
    //                 }
    //             }
    //         }

    //         tempWorkflow._fsm.config.methods.onCondition()
    //         console.log(currentState)
    //     } else if (nodesOrder[i].type === "templateNode") {

    //         if (currentState === "Welcome to our platform 😃" || currentState === "Existing user 🤝😊") {
    //             //send product list
    //             currentState = "product category"
    //             methods.onTemplate = function () {
    //                 var data = JSON.stringify({
    //                     "messaging_product": "whatsapp",
    //                     "recipient_type": "individual",
    //                     "to": "918707349706",
    //                     "type": "interactive",
    //                     "interactive": {
    //                         "type": "button",
    //                         "body": {
    //                             "text": "what would you like to buy"
    //                         },
    //                         "action": {
    //                             "buttons": [
    //                                 {
    //                                     "type": "reply",
    //                                     "reply": {
    //                                         "id": "<UNIQUE_BUTTON_ID_1>",
    //                                         "title": "vegetable"
    //                                     }
    //                                 },
    //                                 {
    //                                     "type": "reply",
    //                                     "reply": {
    //                                         "id": "<UNIQUE_BUTTON_ID_2>",
    //                                         "title": "groceries"
    //                                     }
    //                                 }
    //                             ]
    //                         }
    //                     }
    //                 });
    //                 var config = {
    //                     method: 'post',
    //                     url: 'https://graph.facebook.com/v15.0/113964918201249/messages',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': 'Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE'
    //                     },
    //                     data: data
    //                 };
    //                 axios(config)
    //                     .then(function (response) {
    //                         console.log(JSON.stringify(response.data));
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });
    //             }

    //         } else if (currentState === "vegetable") {
    //             //send vegetable list
    //             methods.onTemplate = function () {
    //                 var data = JSON.stringify({
    //                     "messaging_product": "whatsapp",
    //                     "recipient_type": "individual",
    //                     "to": "918707349706",
    //                     "type": "interactive",
    //                     "interactive": {
    //                         "type": "list",
    //                         "header": {
    //                             "type": "text",
    //                             "text": "Pick any vegetable"
    //                         },
    //                         "body": {
    //                             "text": "Shop now"
    //                         },
    //                         "footer": {
    //                             "text": "from appzoy"
    //                         },
    //                         "action": {
    //                             "button": "select",
    //                             "sections": [
    //                                 {
    //                                     "title": "vegetables",
    //                                     "rows": [
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_1_ID>",
    //                                             "title": "Tomato",
    //                                             "description": "fresh red color"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_2_ID>",
    //                                             "title": "Potato",
    //                                             "description": "a round in space a1 quality"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_3_ID>",
    //                                             "title": "Brinjal",
    //                                             "description": "make best bharta"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_4_ID>",
    //                                             "title": "Mushroom",
    //                                             "description": "enjoy rosted"
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     }
    //                 });

    //                 var config = {
    //                     method: 'post',
    //                     url: 'https://graph.facebook.com/v15.0/113964918201249/messages',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': 'Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE'
    //                     },
    //                     data: data
    //                 };

    //                 axios(config)
    //                     .then(function (response) {
    //                         console.log(JSON.stringify(response.data));
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });
    //             }
    //         } else if (currentState === "groceries") {
    //             //send groceries list
    //             methods.onTemplate = function () {
    //                 var data = JSON.stringify({

    //                     "messaging_product": "whatsapp",
    //                     "recipient_type": "individual",
    //                     "to": "918707349706",
    //                     "type": "interactive",
    //                     "interactive": {
    //                         "type": "list",
    //                         "header": {
    //                             "type": "text",
    //                             "text": "Pick any grocery item"
    //                         },
    //                         "body": {
    //                             "text": "<BODY_TEXT>"
    //                         },
    //                         "footer": {
    //                             "text": "from appzoy"
    //                         },
    //                         "action": {
    //                             "button": "select",
    //                             "sections": [
    //                                 {
    //                                     "title": "Groceries",
    //                                     "rows": [
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_1_ID>",
    //                                             "title": "Wheat",
    //                                             "description": "Aashirwaad aata"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_2_ID>",
    //                                             "title": "Rice",
    //                                             "description": "No. 1 Basmati rice"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_3_ID>",
    //                                             "title": "Tor Daal",
    //                                             "description": "High quality protein"
    //                                         },
    //                                         {
    //                                             "id": "<LIST_SECTION_1_ROW_4_ID>",
    //                                             "title": "Mustard oil",
    //                                             "description": "Bail kolhu best quality"
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     }

    //                 });

    //                 var config = {
    //                     method: 'post',
    //                     url: 'https://graph.facebook.com/v15.0/113964918201249/messages',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': 'Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE'
    //                     },
    //                     data: data
    //                 };

    //                 axios(config)
    //                     .then(function (response) {
    //                         console.log(JSON.stringify(response.data));
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });
    //             }
    //         }

    //         tempWorkflow._fsm.config.methods.onTemplate()
    //     }
    // }





    

//     if (nodesOrder[idxWorkflow].type === "apiNode") {
//       currentState = "apiNode"
//       console.log("api node started")
//       nodeProgress = false
//   } else if (nodesOrder[idxWorkflow].type === "conditionNode") {
//       currentState = "conditionNode"
//       console.log("condition node started")

//   } else if (nodesOrder[idxWorkflow].type === "textNode") {
//       if (currentState === "apiNode") {
//           console.log("api failed")
//       }
//       else if (currentState === "conditionNode") {
//           console.log("new user")
//       }
//       currentState = "textNode"
//   } else if (nodesOrder[idxWorkflow].type === "templateNode") {
//       console.log("template sent")
//       currentState = "templateNode"
//   }