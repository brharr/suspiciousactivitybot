var builder = require('botbuilder');
var https = require('https');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Hi! Would you like to report suspicious activity?');
    },
    function(session, results) {
        if (results.response.toLowerCase() == 'no')
            session.endConversation('Please feel free to contact us again should you change your mind.');
        else
            builder.Prompts.text(session, 'Please describe the suspicious activity.');
    },
    function(session, results) {
        session.privateConversationData.activity = results.response;
        builder.Prompts.text(session, 'Is there any other information that you would like to add before I ask for vehicle and location information?');
    },
    function(session, results) {
        if (results.response.toLowerCase() == 'no')
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        else {
            session.privateConversationData.activity.concat(results.response);
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        }
    },
    function(session, results) {
        session.privateConversationData.vehicle = results.response;
        builder.Prompts.text(session, 'Please provide any physical identifiers of anyone you observed.');
    },
    function(session, results) {
        session.privateConversationData.people = results.response;
        builder.Prompts.text(session, 'Please provide information about the location where the suspicious activity was seen or heard.');
    },
    function(session, results) {
        session.privateConversationData.fromLocation = results.response;
        builder.Prompts.text(session, 'Please provide any information about the location where the people involved may have gone.');
    },
    function(session, results) {
        session.privateConversationData.toLocation = results.response;
        builder.Prompts.text(session, 'Would you please provide your contact information should we have any more questions?');
    },
    function(session, results) {
        if (results.response.toLowerCase() == 'no') {
            session.send('Validating Session Data: ', session.privateConversationData.activity);
            sendActivity(session);
            session.endConversation('Thank you for providing us with this suspicious activity information.');
            s
        } else {
            session.privateConversationData.contact = results.response;
            //session.send('Validating Session Data: ', session.privateConversationData.activity);
            sendActivity(session);
            session.endConversation('Thank you for providing us with this suspicious activity information.');
        }
    }
]);

function sendActivity(session) {
    var host = 'suspicious-incident-api.azurewebsites.net';
    var dataString = JSON.stringify({ 
        "incidentDesc": session.privateConversationData.activity,
        "vehicle": session.privateConversationData.vehicle,
        "fromLocation": session.privateConversationData.fromLocation,
        "toLocation": session.privateConversationData.toLocation,
        "name": session.privateConversationData.contact 
    });
    console.log('Data Object being sent for POST', dataString);
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    };
    var options = {
        host: host,
        path: '/api/incidents',
        method: 'POST',
        headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log('Response String: ', responseString);
            //var responseObject = JSON.parse(responseString);
            //success(responseObject);
        });
    });

    req.write(dataString);
    console.log('Data Object being sent for POST', dataString);
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
};