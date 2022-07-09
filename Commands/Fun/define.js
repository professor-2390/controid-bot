const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "define",
  description: "Looks up a term in the dictionary.",
  options: [
    {
      name: "term",
      description: "The term you want to search.",
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
    const term = interaction.options.getString("term");
    const response = await fetch(
      `http://api.urbandictionary.com/v0/define?term=${term}`
    );
    const data = await response.json();
    if (!data.list[0] || !data.list[0].definition) {
      return interaction.reply({
        content: `Couldn't find any results for ${"`" + term + "`"}`,
        ephemeral: true,
      });
    }

    const definition = data.list[0].definition
      .split("[")
      .join("")
      .split("]")
      .join("");
    const example = data.list[0].example
      .split("[")
      .join("")
      .split("]")
      .join("");
    const defineEmbed = new MessageEmbed()
      .setColor("WHITE")
      .setTitle(`What does ${term} mean?`)
      .addFields(
        { name: "Definition", value: "```" + definition + "```" },
        { name: "Example", value: "```" + (example || "N/A") + "```" }
      )
      .setTimestamp();
    interaction.reply({ embeds: [defineEmbed] });
  },
};
