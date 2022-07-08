require("dotenv").config();
const { Client, Collection } = require("discord.js");

const client = new Client({ intents: 32767 });

const { glob } = require("glob");
const { promisify } = require("util");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

["Events", "Commands"].forEach((handler) => {
  require(`./Handlers/${handler}`)(client, PG, Ascii);
});

client.login(process.env.token);
