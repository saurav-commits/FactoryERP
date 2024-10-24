require('dotenv').config();

const data = {
  development: {
    username: process.env.DEV_DB_USERNAME || 'root',
    password: process.env.DEV_DB_PASSWORD || 'Kleio321@',
    database: process.env.DEV_DB_NAME || "FactoryERP",
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    dialect: "mysql"
  },
  test: {
    username: process.env.TEST_DB_USERNAME || 'root',
    password: process.env.TEST_DB_PASSWORD || null,
    database: process.env.TEST_DB_NAME || 'database_test',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  production: { 
    "url":"mysql://factory:g6kehndcf8GEUwqsv5FrN@98.70.13.173:3004/FactoryERP",
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD,
    database: process.env.PRODUCTION_DATABASE,
    host: process.env.PRODUCTION_HOST,
    port: process.env.PRODUCTION_PORT,
    dialect: 'mysql',
  }
}

module.exports = data;

