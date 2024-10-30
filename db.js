/** Database setup for BizTime. */

const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "Marist23", // Ensure this is a string
    database: "biztime"
});

client.connect();

module.exports = client;