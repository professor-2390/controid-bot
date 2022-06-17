const { SlashCommandBuilder } = require('@discordjs/builders');
const randomPuppy = require("random-puppy");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription(`Sends a random meme from Reddit.`),
  async execute(interaction) {
    const subReddits = ["dankmeme", "meme", "me_irl"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    const img = await randomPuppy(random);
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(img)
        .setTitle(`From /r/${random}`)
        .setURL(`https://reddit.com/r/${random}`);

    interaction.reply({embeds: [embed]})
  }
}