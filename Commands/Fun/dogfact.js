const {MessageEmbed} = require('discord.js')
const fetch = require("node-fetch");

module.exports = {
  name: "dogfact",
  description: "Same as catfact, except it's for dogs.",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const response = await fetch(
      "https://dog-api.kinduff.com/api/facts"
    );
    const data = await response.json();

    const Embed = new MessageEmbed().setTitle("Cat Fact").setColor("WHITE").setDescription(`${data.facts[0]}`)
    interaction.reply({ embeds: [Embed] });
  },
};
