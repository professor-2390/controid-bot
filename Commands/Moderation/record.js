const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Infractions");
const chalk = require("chalk");

module.exports = {
  name: "record",
  description: "Infraction record.",
  options: [
    {
      name: "member",
      description: "Select member",
      type: "USER",
      required: true,
    },
    {
      name: "check",
      description: "Select a specific type of infraction to check.",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "All",
          value: "all",
        },
        {
          name: "Warnings",
          value: "warnings",
        },
        {
          name: "Bans",
          value: "bans",
        },
        {
          name: "Kicks",
          value: "kicks",
        },
        {
          name: "Mutes",
          value: "mutes",
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

    const Target = options.getMember("member");
    const choice = options.getString("check");
    const Response = new MessageEmbed();

    try {
      switch (choice) {
        case "all":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  const W = data.WarnData.length;
                  const B = data.BanData.length;
                  const K = data.KickData.length;
                  const M = data.MuteData.length;

                  Response.setTitle(
                    `${Target.user.username}'s record`
                  ).addFields(
                    { name: "Times warned", value: `${W}` },
                    { name: "Times kicked", value: `${K}` },
                    { name: "Times muted", value: `${M}` },
                    { name: "Times banned", value: `${B}` }
                  );
                  interaction.reply({ embeds: [Response] });
                } else {
                  Response.setDescription(`${Target} has no infractions.`);
                  interaction.reply({ embeds: [Response] });
                }
              }
            );
          }
          break;
        case "warnings":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  if (data.WarnData.length < 1) {
                    Response.setDescription(`${Target} has no warnings.`);
                    interaction.reply({ embeds: [Response] });
                  }
                  Response.setTitle(
                    `${Target.user.username}'s warnings`
                  ).setDescription(
                    `${data.WarnData.map(
                      (w, i) =>
                        `**ID:** ${i + 1}\n **By** ${
                          w.ExecuterTag
                        }\n **Date:** <t:${w.Date}:R>\n **Reason:** ${
                          w.Reason
                        }\n\n`
                    )
                      .join(" ")
                      .slice(0, 4000)}`
                  );
                  interaction.reply({ embeds: [Response] });
                } else {
                  Response.setDescription(`${Target} has no warnings.`);
                  interaction.reply({ embeds: [Response] });
                }
              }
            );
          }
          break;
        case "bans":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  if (data.BanData.length < 1) {
                    Response.setDescription(`${Target} has no bans.`);
                    interaction.reply({ embeds: [Response] });
                  }
                  Response.setTitle(
                    `${Target.user.username}'s mutes`
                  ).setDescription(
                    `${data.BanData.map(
                      (w, i) =>
                        `**ID:** ${i + 1}\n **By** ${
                          w.ExecuterTag
                        }\n **Date:** <t:${w.Date}:R>\n **Reason:** ${
                          w.Reason
                        }\n\n`
                    )
                      .join(" ")
                      .slice(0, 4000)}`
                  );
                  interaction.reply({ embeds: [Response] });
                } else {
                  Response.setDescription(`${Target} has no bans.`);
                  interaction.reply({ embeds: [Response] });
                }
              }
            );
          }
          break;
        case "kicks":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  if (data.KickData.length < 1) {
                    Response.setDescription(`${Target} has no kicks.`);
                    interaction.reply({ embeds: [Response] });
                  }
                  Response.setTitle(
                    `${Target.user.username}'s mutes`
                  ).setDescription(
                    `${data.KickData.map(
                      (w, i) =>
                        `**ID:** ${i + 1}\n **By** ${
                          w.ExecuterTag
                        }\n **Date:** <t:${w.Date}:R>\n **Reason:** ${
                          w.Reason
                        }\n\n`
                    )
                      .join(" ")
                      .slice(0, 4000)}`
                  );
                  interaction.reply({ embeds: [Response] });
                } else {
                  Response.setDescription(`${Target} has no kicks.`);
                  interaction.reply({ embeds: [Response] });
                }
              }
            );
          }
          break;
        case "mutes":
          {
            DB.findOne(
              { GuildID: guild.id, UserID: Target.id },
              async (err, data) => {
                if (err) throw err;
                if (data) {
                  if (data.MuteData.length < 1) {
                    Response.setDescription(`${Target} has no mutes.`);
                    interaction.reply({ embeds: [Response] });
                  }
                  Response.setTitle(
                    `${Target.user.username}'s mutes`
                  ).setDescription(
                    `${data.MuteData.map(
                      (w, i) =>
                        `**ID:** ${i + 1}\n **By** ${
                          w.ExecuterTag
                        }\n **Date:** <t:${w.Date}:R>\n **Reason:** ${
                          w.Reason
                        }\n\n`
                    )
                      .join(" ")
                      .slice(0, 4000)}`
                  );
                  interaction.reply({ embeds: [Response] });
                } else {
                  Response.setDescription(`${Target} has no mutes.`);
                  interaction.reply({ embeds: [Response] });
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
