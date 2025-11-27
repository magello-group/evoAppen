import { AppConfig, DatabaseConfig, ObservabilityConfig } from "./appConfig";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { logger } from "../config/observability";
import config, { IConfig } from "config";

export const getConfig: () => Promise<AppConfig> = async () => {
    // Load any ENV vars from local .env file
    if (process.env.NODE_ENV !== "production") {
        dotenv.config();
    }

    await populateEnvironmentFromKeyVault();

    // Load configuration after Azure KeyVault population is complete
    const typedConfig: IConfig = config;
    const databaseConfig = typedConfig.get<DatabaseConfig>("database");
    const observabilityConfig = typedConfig.get<ObservabilityConfig>("observability");

    if (!databaseConfig.connectionString) {
        logger.error("AZURE_COSMOS_CONNECTION_STRING has not been set. This is required for the API to work.");
        throw new Error("Database connection string not provided.");
    }

    if (!observabilityConfig.connectionString) {
        logger.warn("APPLICATIONINSIGHTS_CONNECTION_STRING has not been set. Monitoring will not be provided.");
    }

    return {
        observability: {
            connectionString: observabilityConfig.connectionString,
            roleName: observabilityConfig.roleName,
        },
        database: {
            connectionString: databaseConfig.connectionString,
            databaseName: databaseConfig.databaseName,
        },
    };
};

const populateEnvironmentFromKeyVault = async () => {
    // If Azure key vault endpoint is defined
    // 1. Login with Default credential (managed identity or service principal)
    // 2. Overlay key vault secrets on top of ENV vars
    const keyVaultEndpoint = process.env.AZURE_KEY_VAULT_ENDPOINT || "";

    if (!keyVaultEndpoint) {
        logger.warn("AZURE_KEY_VAULT_ENDPOINT has not been set. Configuration will be loaded from current environment.");
        return;
    }

    try {
        logger.info("Populating environment from Azure KeyVault...");
        const credential = new DefaultAzureCredential({});
        const secretClient = new SecretClient(keyVaultEndpoint, credential);

        for await (const secretProperties of secretClient.listPropertiesOfSecrets()) {
            const secret = await secretClient.getSecret(secretProperties.name);

            // KeyVault does not support underscores in key names and replaces '-' with '_'
            // Expect KeyVault secret names to be in conventional capitalized snake casing after conversion
            const keyName = secret.name.replace(/-/g, "_");
            process.env[keyName] = secret.value;
        }
    }
    catch (err: any) {
        logger.error(`Error authenticating with Azure KeyVault.  Ensure your managed identity or service principal has GET/LIST permissions. Error: ${err}`);
        throw err;
    }
};