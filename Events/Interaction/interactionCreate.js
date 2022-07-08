const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Collection,
} = require("discord.js");
const cooldowns = new Map();
module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.commands.get(interaction.commandName);
      const Embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("⛔ An error occured while running this command.");
      if (!command)
        return (
          interaction.reply({ embeds: [Embed] }) &&
          client.commands.delete(interaction.commandName)
        );
      if (
        command.permission &&
        !interaction.member.permissions.has(command.permission)
      ) {
        return interaction.reply({
          content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`,
          ephemeral: true,
        });
      }

      command.execute(interaction, client);
    }
  },
};
