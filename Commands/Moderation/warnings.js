const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Infractions");
const chalk = require("chalk");

module.exports = {
  name: "warnings",
  description: "Warning system",
  options: [
    {
      name: "add",
      description: "Add a warning to a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that you want to warn.",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "The reason you are warning the user for.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove warning from a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that you want to remove warning from.",
          type: "USER",
          required: true,
        },
        {
          name: "warning-id",
          description: "The id of the warning you want to remove.",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "check",
      description: "Check the warnings of a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that you want to check warning of.",
          type: "USER",
          required: true,
        },
      ],
    },
    {
      name: "clear",
      description: "Clear all warnings of a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that you want to clear all warnings from.",
          type: "USER",
          required: true,
        },
      ],
    },
  ],
  permission: "MANAGE_MESSAGES",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, member, createdTimestamp } = interaction;

    const Reason = options.getString("reason");
    const Target = options.getUser("user");
    const WarnID = options.getNumber("warning-id") - 1;

    try {
      switch (options.getSubcommand()) {
        case "add":
          {
            if (Target.id == member.id)
              return interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(`You can't warn yourself`),
                ],
              });

            DB.findOne(
              { GuildID: guild.id, UserID: Target.id, UserTag: Target.tag },
              async (err, data) => {
                if (err) throw err;

                if (!data) {
                  data = new DB({
                    GuildID: guild.id,
                    UserID: Target.id,
                    WarnData: [
                      {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.tag,
                        Reason: Reason,
                        Date: parseInt(createdTimestamp / 1000),
                      },
                    ],
                  });
                } else {
                  const obj = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    Reason: Reason,
                    Date: parseInt(createdTimestamp / 1000),
                  };
                  data.WarnData.push(obj);
                }
                data.save();
                const warnEmbed = new MessageEmbed()
                  .setDescription(`**${Target.tag}** has been warned`)
                  .addField("Reason:", `${Reason}`, false)
                  .addField("Issued by:", `${member.user.tag}`, false);
                Target.send({
                  embeds: [
                    new MessageEmbed().setDescription(
                      `You have been warned in **${guild.name}** by ${member.user.tag}\nReason: \`${Reason}\``
                    ),
                  ],
                }).catch(() => {});
                interaction.reply({ embeds: [warnEmbed] });
              }
            );
          }
          break;
        case "remove":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  if (data.WarnData.length === 0) {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed().setDescription(
                          `${Target.tag} has no warnings.`
                        ),
                      ],
                    });
                  }
                  data.WarnData.splice(WarnID, 1);
                  interaction.reply({
                    embeds: [
                      new MessageEmbed().setDescription(
                        `Warning id: ${WarnID + 1} has been removed from ${
                          Target.tag
                        }.`
                      ),
                    ],
                  });
                  data.save();
                } else {
                  return interaction.reply({
                    embeds: [
                      new MessageEMbed().setDescription(
                        `${Target.tag} has no warnings.`
                      ),
                    ],
                  });
                }
              }
            );
          }
          break;

        case "check":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  interaction.reply({
                    embeds: [
                      new MessageEmbed().setDescription(
                        `${data.WarnData.map(
                          (w, i) =>
                            `**ID:** ${i + 1}\n **By** ${
                              w.ExecuterTag
                            }\n **Date:** <t:${w.Date}:R>\n **Reason:** ${
                              w.Reason
                            }\n\n`
                        ).join(" ")}`
                      ),
                    ],
                  });
                } else {
                  interaction.reply({
                    embeds: [
                      new MessageEmbed().setDescription(
                        `**${Target.tag}** has no warnings`
                      ),
                    ],
                  });
                }
              }
            );
          }
          break;
        case "clear":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  await DB.findOneAndDelete({
                    GuildID: guild.id,
                    UserID: Target.id,
                  });
                  interaction.reply({
                    embeds: [
                      new MessageEmbed().setDescription(
                        `Warnings were cleared of ${Target.tag}`
                      ),
                    ],
                  });
                } else {
                  interaction.reply({
                    embeds: [
                      new MessageEmbed().setDescription(
                        `**${Target.tag}** has no warnings`
                      ),
                    ],
                  });
                }
              }
            );
          }
          break;
      }
    } catch (err) {
      console.log(chalk.red(err));
    }
  },
};
