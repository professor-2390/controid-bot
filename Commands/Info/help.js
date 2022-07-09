require("../../Events/Client/ready");
const {
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const fs = require("fs");
const { urls } = require("../../config.json");
const { getRoleColor } = require("../../Utils/getRoleColor");

module.exports = {
  name: "help",
  description:
    "Displays a list of all available commands along with their usage.",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(interaction.guild);
    let debugCmds = "";
    let funCmds = "";
    let infoCmds = "";
    let staffCmds = "";
    fs.readdirSync("./Commands/Debug").forEach((file) => {
      debugCmds += `/${file.slice(0, file.lastIndexOf("."))} `;
    });
    fs.readdirSync("./Commands/Fun").forEach((file) => {
      funCmds += `/${file.slice(0, file.lastIndexOf("."))} `;
    });
    fs.readdirSync("./Commands/Info").forEach((file) => {
      infoCmds += `/${file.slice(0, file.lastIndexOf("."))} `;
    });
    fs.readdirSync("./Commands/Moderation").forEach((file) => {
      staffCmds += `/${file.slice(0, file.lastIndexOf("."))} `;
    });
    // fs.readdirSync("./Commands/Systems").forEach((file) => {
    //   systemCmds += `/${file.slice(0, file.lastIndexOf("."))} `;
    // });

    const helpEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle("Commands")
      .addFields(
        {
          name: `Staff Commands`,
          value: `${"```" + staffCmds + "```"}`,
          inline: true,
        },
        {
          name: `Info Commands`,
          value: `${"```" + infoCmds + "```"}`,
          inline: true,
        },
        {
          name: `Fun Commands`,
          value: `${"```" + funCmds + "```"}`,
          inline: true,
        },
        {
          name: `Debug Commands`,
          value: `${"```" + debugCmds + "```"}`,
          inline: true,
        },
      )
      .setTimestamp();
    const links = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Add me")
        .setURL(botInviteLink)
        .setStyle("LINK"),
      new MessageButton().setLabel("Code").setURL(github).setStyle("LINK")
    );
    interaction.reply({
      embeds: [helpEmbed],
      components: [links],
    });
  },
};
