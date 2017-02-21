var builder = require('botbuilder');
var Client = require('node-rest-client').Client;

var client = new Client();
client.registerMethod('jsonMethod', 'http://suspicious-incident-api.azurewebsites.net/api/')

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
        session.dialogData.activity = results.response;
        builder.Prompts.text(session, 'Is there any other information that you would like to add before I ask for vehicle and location information?');
    },
    function (session, results) {
        if (results.response.toLowerCase() == 'no')
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        else {
            session.userData.activity.concat(results.response);
            builder.Prompts.text(session, 'Please describe any vehicle that may have been involved in the suspicious activity.')
        }
    },
    function (session, results) {
        session.dialogData.vehicle = results.response;
        builder.Prompts.text(session, 'Please provide any physical identifiers of anyone you observed.');
    },
    function (session, results) {
        session.dialogData.people = results.response;
        builder.Prompts.text(session, 'Please provide information about the location where the suspicious activity was seen or heard.');
    },
    function (session, results) {
        session.dialogData.fromLocation = results.response;
        builder.Prompts.text(session, 'Please provide any information about the location where the people involved may have gone.');
    },
    function (session, results) {
        session.dialogData.toLocation = results.response;
        builder.Prompts.text(session, 'Would you please provide your contact information should we have any more questions?');
    },
    function (session, results) {
        if (results.response.toLowerCase() == 'no')
            session.endConversation('Thank you for providing us with this suspicious activity information.');
        else{
            session.dialogData.contact = results.response;
            session.endConversation('Thank you for providing us with this suspicious activity information.');
        }
    }
]);
