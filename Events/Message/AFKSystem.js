const { Message, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/AFKSystem");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   */
  async execute(message) {
    if (message.author.bot) return;

    DB.findOne(
      { GuildID: message.guild.id, UserID: message.author.id },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          if (data.UserID == message.author.id) {
            await DB.deleteOne({
              GuildID: message.guild.id,
              UserID: message.author.id,
            });

            const bckEmbed = new MessageEmbed().setDescription(
              "Welcome back I've removed your AFK"
            );
            message
              .reply({ embeds: [bckEmbed], ephemeral: true })
              .then((msg) => {
                setTimeout(() => msg.delete(), 3000);
              });
          }
        }
      }
    );

    if (message.mentions.members.size) {
      const Embed = new MessageEmbed().setColor("RED");

      message.mentions.members.forEach((m) => {
        DB.findOne(
          { GuildID: message.guild.id, UserID: m.id },
          async (err, data) => {
            if (err) throw err;
            if (data)
              return message.reply({
                embeds: [
                  Embed.setDescription(
                    `${m} went  AFK <t:${data.Time}:R>\n **Status**:  ${data.Status}`
                  ),
                ],
              });
          }
        );
      });
    }
  },
};
