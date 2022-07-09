const { MessageEmbed } = require("discord.js");
const builder = require("nekos.life");
const neko = new builder();

module.exports = {
  name: "owoify",
  description: "Owoifys text.",
  options: [
    {
      name: "text",
      description: "The text you want to owoify.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const text = interaction.options.getString("text");

    if (text.length > 200)
      return message.channel.send(
        `I can't owoify your text, it is over 200 characters long!`
      );

    let owo = await neko.OwOify({ text: text });

    const defineEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Owoify`)
      .addFields(
        { name: "Text", value: "```" + text + "```" },
        { name: "Owoified", value: "```" + owo.owo + "```" }
      )
      .setTimestamp();
    interaction.reply({ embeds: [defineEmbed] });
  },
};
