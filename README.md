# EvoAppen by Magello

Done with the help of this [template](https://learn.microsoft.com/en-us/samples/azure-samples/todo-nodejs-mongo-swa-func/todo-nodejs-mongo-swa-func/).

## Stack
- **Frontend**: TypeScript React, Tailwind CSS, Shadcn
- **Backend**: TypeScript Node.js API with Express
- **Database**: MongoDB running on Azure
- **Authentication**: Login and authentication with Entra using useMsal Hooks and jwt access token to api

## Azure Infrastructure
- [**Azure Static Web Apps**](https://docs.microsoft.com/azure/static-web-apps/) to host the web frontend
- [**Azure Function Apps**](https://docs.microsoft.com/azure/azure-functions/) to host the API backend
- [**Azure Cosmos DB API for MongoDB**](https://docs.microsoft.com/azure/cosmos-db/mongodb/mongodb-introduction) for DB.
- [**Azure Monitor**](https://docs.microsoft.com/azure/azure-monitor/) for monitoring and logging
- [**Azure Key Vault**](https://docs.microsoft.com/azure/key-vault/) for securing secrets

## Getting Started

While this is open sorce, you'll need a azure infrastucrure with env-files. If you work at magello, env files are stored internally (for now). Ask technial contact.

**Clone the repository**

```
git clone git@github.com:magello-group/evoAppen.git
cd evoappen
```

Place .env file for fronend in src/web folder
place .env file for api in src/api folder

 **Install dependencies and run app**

Frontend

```
cd src/web
npm install
npm run dev
```
API
```
cd src/api
npm install
npm start
```

 **Deploy application**

 For now there is no stage/test env, only prod. It you want to release web or api, you will need a "env-folder" for azure from technical contact and install [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview). Install instructions [here](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows). 

 Once you have azd installed you should place the .azure (not zipped) folder in the repo root. 
 Now you should be able to run (from root of repo)


 ```
 azd show
 ```
and get

```
evoAppen
  Services:
    api  https://func-api..../
    web  https://icy-..../
  Environments:
    evo3 [Current]
  View in Azure Portal:
    https://portal.azure.com/#@/
```

To deploy you run either 

```
azd deploy web
azd deploy api

or just 
azd deploy for both
```

Happy coding.


