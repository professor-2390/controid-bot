const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "dadjoke",
  description: "Dad joke in chat.",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Discord Bot (https://github.com/professor-2390/controid-bot)",
      },
    });
    const data = await response.json();

    const Embed = new MessageEmbed()
      .setTitle("Dad Joke")
      .setColor("WHITE")
      .setDescription(`${data.joke}`);
    interaction.reply({ embeds: [Embed] });
  },
};
