const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');
const client = require('nekos.life');
const neko = new client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('owoify')
    .setDescription(`Owoifys text.`)
    .addStringOption((option) => option
      .setName('text')
      .setDescription('The text you want to owoify.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString('text');

    if (text.length > 200) return message.channel.send(`I can't owoify your text, it is over 200 characters long!`)

    let color = getRoleColor(interaction.guild);
    
    let owo = await neko.OwOify({text: text});


    const defineEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Owoify`)
      .addFields(
        { name: 'Text', value: '```' + text + '```' },
        { name: 'Owoified', value: '```' + owo.owo + '```' }
      )
      .setTimestamp();
    interaction.reply({ embeds: [defineEmbed] });
  }
}