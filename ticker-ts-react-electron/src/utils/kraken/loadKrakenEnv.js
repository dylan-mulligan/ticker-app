/**
 * Loads the Kraken .env file for all Kraken utility scripts.
 * Uses dotenv to load environment variables from the .env file located at the project root.
 *
 * @module loadKrakenEnv
 */
// Loads the Kraken .env file for all Kraken utility scripts
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

