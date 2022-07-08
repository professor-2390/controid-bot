const { MessageEmbed } = require("discord.js");
const { getRoleColor } = require("../../Utils/getRoleColor");

module.exports = {
  name: "avatar",
  description: "Displays avatar of a user.",
  options: [
    {
      name: "user",
      description: "Select yhr user you want to view avatar of",
      type: "USER"
    }
  ],
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    let color = getRoleColor(interaction.guild);
    let avatarEmbed;
    if (!user) {
      avatarEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle("Your avatar")
        .setImage(interaction.member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp();
    } else {
      avatarEmbed = new MessageEmbed()
        .setColor(color)
        .setTimestamp()
        .setTitle(`${user.username}'s avatar`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }));
    }
    interaction.reply({ embeds: [avatarEmbed] });
  },
};
