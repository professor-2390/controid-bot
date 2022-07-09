const client = require("../../index");
const { MessageEmbed } = require("discord.js");

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription(
            `🎶 Playing \`${song.name}\` - \`${
              song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`
          ),
      ],
    })
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription(
            `🎶 Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
          ),
      ],
    })
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription(
            `🎶 Added \`${playlist.name}\` playlist (${
              playlist.songs.length
            } songs) to queue\n${status(queue)}`
          ),
      ],
    })
  )
  .on("error", (channel, e) => {
    channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `❌ An error encountered: ${e.toString().slice(0, 1974)}`
          ),
      ],
    });
  })
  .on("empty", (queue) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription("Voice channel is empty, leaving the channel."),
      ],
    })
  )
  .on("searchNoResult", (message, query) =>
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription(`❌ No result found for \`${query}\`!)]}`),
      ],
    })
  )
  .on("finish", (queue) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("DARK_PURPLE")
          .setDescription("Queue finished, leaving the channel."),
      ],
    })
  );
