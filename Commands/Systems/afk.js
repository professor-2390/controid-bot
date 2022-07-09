const { MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/AFKSystem");
const chalk = require("chalk");

module.exports = {
  name: "afk",
  description: "Afk system.",
  options: [
    {
      name: "set",
      type: "SUB_COMMAND",
      description: "Set your status.",
      options:[
        {
            name: "status",
            description: "Set your status",
            type: "STRING",
            required: true,
        }
      ]
    },
    {
      name: "return",
      type: "SUB_COMMAND",
      description: "Return from AFK.",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options, user, createdTimestamp } = interaction;

    const Embed = new MessageEmbed().setAuthor(
      user.tag,
      user.displayAvatarURL({ dynamic: true })
    );

    const afkStatus = options.getString("status");

    try {
      switch (options.getSubcommand()) {
        case "set": {
          await DB.findOneAndUpdate(
            { GuildID: guild.id, UserID: user.id },
            { Status: afkStatus, Time: parseInt(createdTimestamp / 1000) },
            { new: true, upsert: true }
          );

          Embed.setColor("GREEN").setDescription(
            `Your AFK has been updated to \`${afkStatus}\``
          );

          return interaction.reply({ embeds: [Embed], ephemeral: true });
        }
        case "return": {
            await DB.deleteOne(
                { GuildID: guild.id, UserID: user.id },
              );
    
              Embed.setColor("RED").setDescription(
                `Your AFK status has been removed.`
              );
    
              return interaction.reply({ embeds: [Embed], ephemeral: true });
        }
      }
    } catch (err) {
      console.log(chalk.red(err));
    }
  },
};
