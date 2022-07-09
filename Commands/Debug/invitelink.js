const { urls:{botInviteLink} } = require("../../config.json");

module.exports = {
  name: "invitelink",
  description: "Sends the invite link for the bot.",
  async execute(interaction) {
    interaction.reply({ content: botInviteLink, ephemral: true });
  },
};
