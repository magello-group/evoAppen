# RetroAppen by Magello

What is RetroAppen?

*I grunder är det ett verktyg för att lämna och visa feedback för konsulter, visualiserat i spindeldiagram.*

Developed with the help of this [template](https://learn.microsoft.com/en-us/samples/azure-samples/todo-nodejs-mongo-swa-func/todo-nodejs-mongo-swa-func/).

## Stack
- **Frontend**: TypeScript React, Tailwind CSS, Shadcn
- **Backend**: TypeScript Node.js API with Express
- **Database**: MongoDB running on Azure
- **Authentication**: Login and authentication with Entra using useMsal Hooks and JWT access tokens for API

## Azure Infrastructure
- [**Azure Static Web Apps**](https://docs.microsoft.com/azure/static-web-apps/) to host the web frontend
- [**Azure Function Apps**](https://docs.microsoft.com/azure/azure-functions/) to host the API backend
- [**Azure Cosmos DB API for MongoDB**](https://docs.microsoft.com/azure/cosmos-db/mongodb/mongodb-introduction) for database
- [**Azure Monitor**](https://docs.microsoft.com/azure/azure-monitor/) for monitoring and logging
- [**Azure Key Vault**](https://docs.microsoft.com/azure/key-vault/) for securing secrets

## Running the application

While this project is open source, you'll need an Azure infrastructure with environment files. If you work at Magello, environment files are stored internally. Please contact the technical team for access.

### Clone the Repository
```bash
git clone git@github.com:magello-group/evoAppen.git
cd evoappen
```
Place the .env file for the frontend in the src/web folder.
Place the .env file for the API in the src/api folder.

Install Dependencies and Run the App

Frontend

```
cd src/web
npm install
npm run dev
```

Api
```
cd src/api
npm install
npm start
```

### Debug the application in Visual Studio Code

> Be sure that you have executed `npm install` in both the `api` and `web` project to get all dependencies. Use at least the LTS version of Node.js.

The project has some prerequisites that is required when debugging in Visual Studio Code:
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) must be installed.
- [Azure Functions Development tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)

All other dependencies should be installed using npm install.

In addition, there are two other requirements connected to Azure (these are general requirements as well for running it live):
1. A Cosmos Mongo DB account with a database.
  - Since this repo uses `mongoose` for db communication you could use any type of MongoDB instance, it is not restricted to Azure Cosmos DB for MongoDB.
2. An Entra Id app registration (for authentication process).

Lastly, both the `api` and `web` project requires an `.env` file with environment configuration.

#### `.env` file `api`
```
AZURE_COSMOS_CONNECTION_STRING="<Connection string to the Cosmos MongoDB instance>"
AZURE_COSMOS_DATABASE_NAME="<DB name for the Mongo DB to use>"
```

#### `.env` file for `web`
```
VITE_API_CLIENT_ID=<The client id of the entra app registration that was created>
```

### Deploy the application
Currently, there is no staging or test environment, only production. To release the web or API, you will need an "env-folder" for Azure from the technical team and the Azure Developer CLI. Follow the installation instructions. Access to Azure resources will also need to be granted.

Deploying the Application
Ensure you have the azd installed.
Place the .azure (not zipped) folder in the root of the repository.
From the root of the repository, run:

```
azd auth  # I think(?)
azd show
```

You should see output similar to:

```
evoAppen
  Services:
    api  https://func-api..../
    web  https://icy-..../
  Environments:
    evo3 [Current]
  View in Azure Portal:
    https://portal.azure.com/#@/

````

To deploy, run:
```
azd deploy web   # To deploy the frontend
azd deploy api   # To deploy the backend

# Or deploy both
azd deploy
```

Happy coding!

