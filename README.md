## Synopsis

This is one project of two projects that makes up the Suspicious Activity Bot Application for Azure Commerical and Government. This particular project contains the actual Bot application used by users to post a suspicious activity. It makes a REST API call to the POST method within the hotline api project. A full description of the project can be found in the following blog post: [Deploying a Suspicious Activity Bot in Azure Commercial or Azure Government](https://blogs.msdn.microsoft.com/cloud_solution_architect/2017/05/16/deploying-a-suspicious-activity-bot-in-azure-commercial-or-azure-government)

NOTE: Please not that this project was created using the Console Channel as I do not have the necessary business subscriptions to configure it for other channels. You will need to modify the code if you would like to productionize this bot for Skype, Facebook Messenger, or Skype for Business. 

## Motivation

I built these two projects to show how easy it is to create and deploy a Bot Application in either the Azure Commerical or Azure Government regions while also showing and discussing the differences. See the blog post above for more information.

## Installation

The following documentation link should give all the instructions necessary for deploy this Bot application to an Azure App Service and setup Continuous Deployment from Github as well: [Deploy a bot to Azure from Github](https://docs.microsoft.com/en-us/bot-framework/deploy-bot-github)

NOTE: You will need to create a Setting in the App Service to store the URL of the Hotline API. The name of the App Setting will need to be CUSTOMRESTURL_hotlineapi. See the following documentation for more information on how to create new App Settings: [Configure web apps in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-configure)

## Built With

* [NodeJS](https://nodejs.org) - Development engine and application server
* [Azure Bot Framework](https://dev.botframework.com/) - The web framework used

## Code Example

For a user to interact with the bot, all they have to do is say "hi" and the bot will respond with the correct set of questions.

## Contributors

This project is meant to be consumed and then modified on a per customer or developer basis. Please feel free to either file an Issue or perform a Pull request should you find a bug or would like to make an enhancement on your own.