const { MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Infractions");

module.exports = {
  name: "kick",
  description: "Kicks the target member.",
  options: [
    {
      name: "member",
      description: "Select a member to kick.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Provide a reason for this kick.",
      type: "STRING",
      required: false,
    },
  ],
  permission: "KICK_MEMBERS",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, options } = interaction;

    const Target = options.getMember("member");
    const Reason = options.getString("reason");

    if (Target.id === member.id)
      return interaction.reply({
        embeds: [new MessageEmbed().setDescription(`You can't kick yourself`)],
      });

    if (Target.roles.highest.position > member.roles.highest.position)
      return interaction.reply({
        embeds: [
          new MessageEmbed().setDescription(
            `You cannot kick someone with a superior role.`
          ),
        ],
      });

    if (Target.permissions.has(this.permission))
      return interaction.reply({
        embeds: [
          new MessageEmbed().setDescription(
            `You cannot kick someone with \`${this.permission}\` permission.`
          ),
        ],
      });

    DB.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new DB({
          GuildID: guild.id,
          UserID: Target.id,
          KickData: [
            {
              ExecuterID: member.id,
              ExecuterTag: member.user.tag,
              TargetID: Target.id,
              TargetTag: Target.user.tag,
              Reason: Reason,
              Date: parseInt(interaction.createdTimestamp / 1000),
            },
          ],
        });
      } else {
        const KickDataObject = {
          ExecuterID: member.id,
          ExecuterTag: member.user.tag,
          TargetID: Target.id,
          TargetTag: Target.user.tag,
          Reason: Reason,
          Date: parseInt(interaction.createdTimestamp / 1000),
        };
        data.KickData.push(KickDataObject);
      }
      data.save();
    });
    Target.send({
      embeds: [
        new MessageEmbed().setDescription(
          `You have been kicked from **${guild.name}** by ${
            member.user.tag
          }\n**Reason:** \`${Reason || "No Reason Provided"}\``
        ),
      ],
    }).catch(() => {});

    Target.kick({ reason: Reason }).catch((err) => {
      console.log(err);
    });

    interaction.reply({
      embeds: [
        new MessageEmbed().setDescription(
          `**${Target}** has been kicked\n **Reason:** ${
            Reason || "No reason provided"
          }`
        ),
      ],
    });
  },
};
