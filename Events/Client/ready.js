const os = require("os");
const chalk = require("chalk");
const ms = require("ms");
const mongoose = require("mongoose");

const DB = require("../../Schemas/ClientDB");

async function getMemoryUsage() {
  return process.memoryUsage().heapUsed / (1024 * 1024).toFixed(2);
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [{ name: "/help", type: "LISTENING" }],
      status: "dnd",
    });

    const Database = process.env.database;
    if (!Database) return;
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(
          chalk.green(chalk.underline("🟢 Successfully connected to database!"))
        );
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
    console.log(chalk.green(chalk.underline("🔴 Bot Online!")));

    let memArray = [];

    setInterval(async () => {

      memArray.push(await getMemoryUsage());

      if (memArray.length >= 14) {
        memArray.shift();
      }

      await DB.findOneAndUpdate(
        {
          Client: true,
        },
        {
          Memory: memArray,
        },
        {
          upsert: true,
        }
      );
    }, ms("5s"));
  },
};
