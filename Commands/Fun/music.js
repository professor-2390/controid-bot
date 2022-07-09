const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const chalk = require("chalk");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
  name: "music",
  description: "A complete music system",
  public: true,
  options: [
    {
      name: "play",
      description: "Play a song.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "query",
          description: "Provide a name or url for the song.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "volume",
      description: "Alter the volume.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "percent",
          description: "10 = 10%",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "settings",
      description: "Select an option.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            { name: "📃 View Queue", value: "queue" },
            { name: "⏭ Skip Song", value: "skip" },
            { name: "⏸ Pause Song", value: "pause" },
            { name: "⏩ Resume Song", value: "resume" },
            { name: "⏹ Stop Music", value: "stop" },
            { name: "🔀 Shuffle Queue", value: "shuffle" },
            { name: "🔃 Toggle Autoplay Mode", value: "AutoPlay" },
            { name: "⏺ Add a Related Song", value: "RelatedSong" },
            { name: "🔁 Toggle Repeat Mode", value: "RepeatMode" },
          ],
        },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction;
    const VoiceChannel = member.voice.channel;

    if (!VoiceChannel)
      return await interaction.reply({
        content: "You must be in a voice channel to be able to play music!",
        ephemeral: true,
      });

    if (
      guild.me.voice.channelId &&
      VoiceChannel.id !== guild.me.voice.channelId
    )
      return await interaction.reply({
        content: `I'm already playing music in <#${guild.me.voice.channelId}>.`,
        ephemeral: true,
      });

    try {
      switch (options.getSubcommand()) {
        case "play": {
          client.distube.play(VoiceChannel, options.getString("query"), {
            textChannel: channel,
            member: member,
          });
          await interaction.reply("🎼 Added to queue");
        }
        case "volume": {
          const Volume = options.getNumber("percent");
          if (Volume > 100 || Volume < 1) {
            return await interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  "You have to specify a number between 1 and 100."
                ),
              ],
            });
          }
          client.distube.setVolume(VoiceChannel, Volume);
          return await interaction.reply({
            embeds: [
              new MessageEmbed().setDescription(
                `📶 Volume has been set to \`${Volume}%\``
              ),
            ],
          });
        }
        case "settings": {
          const queue = await client.distube.getQueue(VoiceChannel);

          if (!queue)
            return await interaction.reply({
              embeds: [
                new MessageEmbed().setDescription(
                  "❌ The queue is current empty."
                ),
              ],
            });
          switch (options.getString("options")) {
            case "skip": {
              await queue.skip(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription("⏭ Song has been skipped."),
                ],
              });
            }
            case "pause": {
              await queue.pause(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription("⏸ Song has been paused."),
                ],
              });            }
            case "resume": {
              await queue.resume(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription("⏭ Song has been resumed."),
                ],
              });
            }
            case "shuffle": {
              await queue.shuffle(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    "🔀 The queue has been shuffled."
                  ),
                ],
              });
            }
            case "RelatedSong": {
              await queue.addRelatedSong(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    "🈁 A related song has been added to the queue."
                  ),
                ],
              });
            }
            case "AutoPlay": {
              let Mode = await queue.toggleAutoplay(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    `🔁 Autoplay mode is set to: ${Mode ? "On" : "Off"}`
                  ),
                ],
              });
            }
            case "RepeatMode": {
              let Mode2 = await queue.setRepeatMode(queue);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    `🔁 Repeat mode is set to: ${(Mode2 = Mode2
                      ? Mode2 == 2
                        ? "Queue"
                        : "Song"
                      : "Off")}`
                  ),
                ],
              });
            }
            case "stop": {
              await queue.stop(VoiceChannel);
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    "⏹ Music has been stopped."
                  ),
                ],
              });
            }
            case "queue": {
              return await interaction.reply({
                embeds: [
                  new MessageEmbed().setDescription(
                    `${queue.songs.map(
                      (song, id) =>
                        `\n**${id + 1}**. ${song.name} - \`${
                          song.formattedDuration
                        }\``
                    )}`
                  ),
                ],
              });
            }
          }
        }
      }
    } catch (e) {
      console.log(chalk.red(e));
    }
  },
};
