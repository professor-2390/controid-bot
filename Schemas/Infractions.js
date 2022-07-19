const { model, Schema } = require("mongoose");

module.exports = model(
  "Infractions",
  new Schema({
    GuildID: String,
    UserID: String,
    WarnData: Array,
    KickData: Array,
    BanData: Array,
    MuteData: Array,
  })
);
