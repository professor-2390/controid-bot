require("../../Events/Client/ready")
const { Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Displays the bot's current status.",
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction, client) {
    const Embed = new MessageEmbed()
      .setColor("WHITE")
      .setDescription(
        `**Client**: \`🟢 ONLINE\` - \`${client?.ws?.ping || 'undefined'}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>`
      );

      interaction.reply({embeds: [Embed]})
  },
};
