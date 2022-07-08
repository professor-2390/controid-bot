const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remindme",
  description: "Sets a timer for a reminder.",
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
