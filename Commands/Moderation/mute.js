const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Infractions");
const chalk = require("chalk");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Mute a user.",
  options: [
    {
      name: "add",
      description: "Add mute to a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "The user you want to mute.",
          type: "USER",
          required: true,
        },
        {
          name: "duration",
          description: "Select the duration of this mute (1s/1m/1h/1d)",
          type: "STRING",
          required: true,
        },
        {
          name: "reason",
          description: "Provide a reason for this mute.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove mute from a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to remove mute from.",
          type: "USER",
        },
      ],
    },
  ],
  permission: "MANAGE_MESSAGES",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, options } = interaction;

    const Reason = options.getString("reason");
    const Target = options.getMember("member");
    const TargetID = guild.members.cache.get(Target.id);
    const Duration = options.getString("duration");
    const UnmuteTarget = options.getString("user");

    try {
      switch (options.getSubcommand()) {
        case "add": {
          if (Target.id === member.id)
            return interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(`You can't ban yourself`),
              ],
            });

          if (Target.roles.highest.position > member.roles.highest.position)
            return interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  `You cannot ban someone with a superior role.`
                ),
              ],
            });

          if (Target.permissions.has(this.permission))
            return interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  `You cannot mute someone with \`${this.permission}\` permission.`
                ),
              ],
            });

          if (Duration > 1209600000)
            return interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  `Please enter a length of time of 14 days or less (1s/1m/1h/1d).`
                ),
              ],
            });

          DB.findOne(
            { GuildID: guild.id, UserID: Target.id },
            async (err, data) => {
              if (err) throw err;
              if (!data) {
                data = new db({
                  GuildID: guild.id,
                  UserID: Target.id,
                  MuteData: [
                    {
                      ExecuterID: member.id,
                      ExecuterTag: member.user.tag,
                      TargetID: Target.id,
                      TargetTag: Target.user.tag,
                      Reason: Reason,
                      Duration: Duration,
                      Date: parseInt(interaction.createdTimestamp / 1000),
                    },
                  ],
                });
              } else {
                const MuteDataObject = {
                  ExecuterID: member.id,
                  ExecuterTag: member.user.tag,
                  TargetID: Target.id,
                  TargetTag: Target.user.tag,
                  Reason: Reason,
                  Duration: Duration,
                  Date: parseInt(interaction.createdTimestamp / 1000),
                };
                data.MuteData.push(MuteDataObject);
              }
              data.save();
            }
          );
          TargetID.timeout(ms(Duration), Reason);
          const muteEmbed = new MessageEmbed()
            .setDescription(`**${Target.user.tag}** has been muted`)
            .addField("Duration:", `${Duration}`, false)
            .addField("Reason:", `${Reason}`, false)
            .addField("Issued by:", `${member.user.tag}`, false);
          Target.send({
            embeds: [
              new MessageEmbed().setDescription(
                `You have been muted in **${guild.name}** for ${Duration} by ${member.user.tag}\n**Reason:** \`${Reason}\``
              ),
            ],
          }).catch(() => {});
          interaction.reply({ embeds: [muteEmbed] });
        }
      }
    } catch (err) {
      console.log(chalk.red(err));
    }
  },
};
