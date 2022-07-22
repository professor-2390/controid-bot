const { GiveawaysManager } = require("discord-giveaways");
const giveawayModel = require("../Schemas/GiveawayDB");

module.exports = (client) => {
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
      return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
      await giveawayModel.create(giveawayData);
      return true;
    }

    async editGiveaway(messageId, giveawayData) {
      await giveawayModel.updateOne({ messageId }, giveawayData).exec();
      return true;
    }

    async deleteGiveaway(messageId) {
      await giveawayModel.deleteOne({ messageId }).exec();
      return true;
    }
  };

  const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
      botsCanWin: false,
      embedColor: "#CA90F7",
      embedColorEnd: "#E9982A",
      reaction: "<a:GiveawayEmoji:999711005284249690>",
    },
  });

  client.giveawaysManager = manager;
};
