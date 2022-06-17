const commands = require("../../index");

const chalk = require("chalk");

module.exports = (client) => {
  console.log(chalk.green(chalk.underline.bgGreen("🔴 Bot Online!")));
  client.user.setActivity("/help.", { type: "LISTENING" });
  client.guilds.cache.forEach((guild) => {
    client.application.commands
      .set(commands, guild.id)
      .catch((err) => console.log(err));
  });
};
