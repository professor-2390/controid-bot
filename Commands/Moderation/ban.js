const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Infractions");

module.exports = {
  name: "ban",
  description: "Bans a user.",
  options: [
    {
      name: "add",
      description: "Add a ban to a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "The user you want to ban.",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "Provide a reason for this ban.",
          type: "STRING",
          required: true,
        },
        {
          name: "messages",
          description:
            "The number of days or hours to delete messages (24h / 1-7d).",
          type: "STRING",
          required: false,
          choices: [
            {
              name: "24 hours",
              value: "24",
            },
            {
              name: "1 day",
              value: "1",
            },
            {
              name: "2 days",
              value: "2",
            },
            {
              name: "3 days",
              value: "3",
            },
            {
              name: "4 days",
              value: "4",
            },
            {
              name: "5 days",
              value: "5",
            },
            {
              name: "6 days",
              value: "6",
            },
            {
              name: "7 days",
              value: "7",
            },
          ],
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a ban from a user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User id of the user you want to remove ban from.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  permission: "BAN_MEMBERS",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, options } = interaction;

    const Reason = options.getString("reason");
    const Target = options.getMember("member");
    const UnbanTarget = options.getString("user");
    const Amount = options.getUser("messages");

    try {
      switch (options.getSubcommand()) {
        case "add":
          {
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
                    `You cannot ban someone with \`${this.permission}\` permission.`
                  ),
                ],
              });

            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (!data || !data.BanData) {
                  data = new DB({
                    GuildID: guild.id,
                    UserID: Target.id,
                    BanData: [
                      {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Messages: Amount,
                        Reason: Reason,
                        Date: parseInt(interaction.createdTimestamp / 1000),
                      },
                    ],
                  });
                } else {
                  const BanDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: Target.id,
                    TargetTag: Target.user.tag,
                    Messages: Amount,
                    Reason: Reason,
                    Date: parseInt(interaction.createdTimestamp / 1000),
                  };
                  data.BanData.push(BanDataObject);
                }
                data.save();
              }
            );
            Target.send({
              embeds: [
                new MessageEmbed().setDescription(
                  `You have been banned from **${guild.name}** for: \`${Reason}\``
                ),
              ],
            }).catch(() => {});
            Target.ban({ days: Amount, reason: Reason }).catch((err) => {
              console.log(err);
            });

            interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  `${Target} has been banned for \`${Reason}\``
                ),
              ],
            });
          }
          break;
        case "remove": {
          guild.members
            .unban(UnbanTarget)
            .then(() => {
              interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    `${UnbanTarget} has been unbanned.`
                  ),
                ],
              });
            })
            .catch((e) => {
              interaction.reply({
                embeds: [new MessageEmbed().setDescription(`Invalid user id.`)],
              });
              return;
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};
