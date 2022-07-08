const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Command Loaded");

  CommandsArray = [];

  (await PG(`${process.cwd()}/Commands/**/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(file.split("/")[7], "⛔ Failed", "Missing a name.");

    if (!command.context && !command.description)
      return Table.addRow(
        chalk.red(file.split("/")[7], "⛔ Failed", "Missing a description.")
      );

    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else
        return Table.addRow(
          file.split("/")[7],
          "⛔ Failed",
          "Permission is invalid."
        );
    }

    client.commands.set(command.name, command);
    CommandsArray.push(command);

    await Table.addRow(command.name, "✅ Successful");
  });
  console.log(Table.toString());

  client.on("ready", async () => {
    client.guilds.cache.forEach((g) => {
      g.commands.set(CommandsArray);
    });
  });
};
