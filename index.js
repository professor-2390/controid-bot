require("dotenv").config();
const { Client, Collection } = require("discord.js");

const client = new Client({ intents: 32767 });

const { glob } = require("glob");
const { promisify } = require("util");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')

client.distube = new DisTube(client, {
  emitNewSongOnly:true,
  leaveOnFinish:true,
  emitAddSongWhenCreatingQueue:false,
  plugins: [
    new SpotifyPlugin({
      api: {
        clientId: process.env.spotifyClientID,
        clientSecret: process.env.spotifyClientSecret
      },
    })
  ]
});
module.exports = client;

["Events", "Commands"].forEach((handler) => {
  require(`./Handlers/${handler}`)(client, PG, Ascii);
});

client.login(process.env.token);
