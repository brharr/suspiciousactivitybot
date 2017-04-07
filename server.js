var builder = require('botbuilder');
var Client = require('node-rest-client').Client;

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Hi! Would you like to report suspicious activity?');
    },
    function (session, results) {
        if (results.response.toLowerCase() == 'no')
            session.endConversation('Please feel free to contact us again should you change your mind.');
        else
            builder.Prompts.text(session, 'Please describe the suspicious activity.');
    },
    function (session, results) {
        session.privateConversationData.activity = results.response;
        builder.Prompts.text(session, 'Is there any other information that you would like to add before I ask for vehicle and location information?');
    },
    function (session, results) {
        if (results.response.toLowerCase() == 'no')
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        else {
            session.privateConversationData.activity.concat(results.response);
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        }
    },
    function (session, results) {
        session.privateConversationData.vehicle = results.response;
        builder.Prompts.text(session, 'Please provide any physical identifiers of anyone you observed.');
    },
    function (session, results) {
        session.privateConversationData.people = results.response;
        builder.Prompts.text(session, 'Please provide information about the location where the suspicious activity was seen or heard.');
    },
    function (session, results) {
        session.privateConversationData.fromLocation = results.response;
        builder.Prompts.text(session, 'Please provide any information about the location where the people involved may have gone.');
    },
    function (session, results) {
        session.privateConversationData.toLocation = results.response;
        builder.Prompts.text(session, 'Would you please provide your contact information should we have any more questions?');
    },
    function (session, results) {
        if (results.response.toLowerCase() == 'no') {
            session.send('Validating Session Data: ', session.privateConversationData.activity);
            sendActivity(session);
            session.endConversation('Thank you for providing us with this suspicious activity information.');s
        }
        else {
            session.privateConversationData.contact = results.response;
            session.send('Validating Session Data: ', session.privateConversationData.activity);
            sendActivity(session);
            session.endConversation('Thank you for providing us with this suspicious activity information.');
        }
    }
]);

function sendActivity(session) {
    var client = new Client();
    client.registerMethod('jsonMethod', 'http://suspicious-incident-api.azurewebsites.net/api/incidents', 'POST');

    // set content-type header and data as json in args parameter 
    var args = {
        data: { 
            "incidentdesc" : session.privateConversationData.activity,
            "vehicle" : session.privateConversationData.vehicle,
            "fromLocation" : session.privateConversationData.fromLocation,
            "toLocation" : session.privateConversationData.toLocation,
            "name": session.privateConversationData.contact
        },
        headers: { "Content-Type": "application/json" }
    };

    client.methods.postMethod(args, function (data, response) {
        // parsed response body as js object 
        console.log(data);
        // raw response 
        console.log(response);
    });
}
