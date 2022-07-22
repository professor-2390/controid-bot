const { CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "giveaway",
  description: "A giveaway system.",
  options: [
    {
      name: "start",
      description: "Create a giveaway",
      type: "SUB_COMMAND",
      options: [
        {
          name: "duration",
          description: "Duration for this giveaway (1m, 1h, 1d)",
          type: "STRING",
          required: true,
        },
        {
          name: "winners",
          description: "Amount of winners for this giveaway.",
          type: "INTEGER",
          required: true,
        },
        {
          name: "prize",
          description: "Provide the name of the prize for this giveaway.",
          type: "STRING",
          required: true,
        },
        {
          name: "channel",
          description: "Select the channel to start the giveaway in.",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    },
    {
      name: "actions",
      description: "Actions for giveaways.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "end",
              value: "end",
            },
            {
              name: "pause",
              value: "pause",
            },
            {
              name: "unpause",
              value: "unpause",
            },
            {
              name: "reroll",
              value: "reroll",
            },
            {
              name: "delete",
              value: "delete",
            },
          ],
        },
        {
          name: "message-id",
          description: "Provide the message id of the giveaway.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  permission: "MANAGE_MESSAGES",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { options } = interaction;

    const successEmbed = new MessageEmbed().setColor("GREEN");
    const errorEmbed = new MessageEmbed().setColor("RED");
    switch (options.getSubcommand()) {
      case "start":
        {
          const gchannel = options.getChannel("channel") || interaction.channel;
          const duration = options.getString("duration");
          const winnerCount = options.getInteger("winners");
          const prize = options.getString("prize");

          client.giveawaysManager
            .start(gchannel, {
              duration: ms(duration),
              winnerCount,
              prize,
              messages: {
                giveaway:
                  "<a:GiveawayEmoji:999711005284249690> **GIVEAWAY** <a:GiveawayEmoji:999711005284249690>",
                giveawayEnded:
                  "<a:GiveawayEmoji:999711005284249690> **GIVEAWAY ENDED** <a:GiveawayEmoji:999711005284249690>",
                  inviteToParticipate: ' ',
                winMessage:
                  "Congratulations, {winners} You won **{this.prize}**",
                noWinner: "<:Gift:999999532689530930> No winners",
                winners: "> **Winners:**",
                drawing: '<:dot:1000011466180669530> Ends {timestamp}',
                embedFooter: ''
              },
              pauseOptions: {
                content: "⚠️ **THIS GIVEAWAY IS PAUSED !**",
              },
            })
            .then(async () => {
              successEmbed.setDescription("Giveaway was successfully started.");
              return interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            })
            .catch((err) => {
              errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
              return interaction.reply({ embeds: [errorEmbed] });
            });
        }
        break;

      case "actions":
        {
          const messageId = options.getString("message-id");

          const giveaway = client.giveawaysManager.giveaways.find(
            (g) =>
              g.guildId === interaction.guildId && g.messageId === messageId
          );

          if (!giveaway) {
            errorEmbed.setDescription(
              `Unable to find the giveaway with the message id of : **${messageId}** in this guild.`
            );
            return interaction.reply({
              embeds: [errorEmbed],
              ephemeral: true,
            });
          }

          switch (options.getString("options")) {
            case "end":
              {
                client.giveawaysManager
                  .end(messageId)
                  .then(async () => {
                    successEmbed.setDescription(
                      `The giveaway which has the ID of \`${messageId}\` has been ended.`
                    );
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(
                      `An error has occurred\n\`${err}\``
                    );
                    return interaction.reply({ embeds: [errorEmbed] });
                  });
              }
              break;
            case "pause":
              {
                client.giveawaysManager
                  .pause(messageId)
                  .then(async () => {
                    successEmbed.setDescription(
                      `The giveaway which has the ID of \`${messageId}\` has been paused.`
                    );
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(
                      `An error has occurred\n\`${err}\``
                    );
                    return interaction.reply({ embeds: [errorEmbed] });
                  });
              }
              break;
            case "unpause":
              {
                client.giveawaysManager
                  .unpause(messageId)
                  .then(async () => {
                    successEmbed.setDescription(
                      `The giveaway which has the ID of \`${messageId}\` has been unpaused.`
                    );
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(
                      `An error has occurred\n\`${err}\``
                    );
                    return interaction.reply({ embeds: [errorEmbed] });
                  });
              }
              break;
            case "reroll":
              {
                client.giveawaysManager
                  .reroll(messageId, {
                    messages: {
                      congrat:
                        "<a:GiveawayEmoji:999711005284249690> New winner(s):\n • {winners}!\n Congratulations, you won **{this.prize}**!",
                      error:
                        "No valid participations, no new winner(s) can be chosen!",
                    },
                  })
                  .then(async () => {
                    successEmbed.setDescription(
                      `The giveaway which has the ID of \`${messageId}\` has been rerolled.`
                    );
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(
                      `An error has occurred\n\`${err}\``
                    );
                    return interaction.reply({ embeds: [errorEmbed] });
                  });
              }
              break;
            case "delete":
              {
                client.giveawaysManager
                  .delete(messageId)
                  .then(async () => {
                    successEmbed.setDescription(
                      `The giveaway which has the ID of \`${messageId}\` has been deleted.`
                    );
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(
                      `An error has occurred\n\`${err}\``
                    );
                    return interaction.reply({ embeds: [errorEmbed] });
                  });
              }
              break;
          }
        }
        break;
    }
  },
};
