const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(`Bulk deletes a certain amount of messages.`)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The number of messages you want to delete.`)
        .setRequired(true)
    ),
  requiredPerms: ["MANAGE_MESSAGES"],
  botRequiredPerms: ["MANAGE_MESSAGES"],
  async execute(interaction) {
    let amount = interaction.options.get("amount").value;

    if (amount < 2 || amount > 100) {
      return interaction.reply({
        content: `You must enter a number higher than 1 and less than 100.`,
        ephemeral: true,
      });
    }

    await interaction.channel.bulkDelete(amount, true);
    const clearEmbed = new MessageEmbed()
      .setTitle(`Cleared Messages`)
      .addFields(
        { name: "Cleared by:", value: `${interaction.member.user.username}` },
        { name: "Amount of Messages Deleted:", value: `${amount}` },
        { name: "Channel:", value: `${interaction.channel.name}` }
      );
    interaction.reply({
      embeds: [clearEmbed],
    });
    // .catch((error) => {
    //   return console.log(`${error}`);
    // });
  },
};
