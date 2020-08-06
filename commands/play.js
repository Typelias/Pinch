const { play } = require('../utils/play');
const { ytKey } = require('../config.json');
const ytdl = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const yt = new YouTubeAPI(ytKey);

module.exports = {
    name: 'play',
    description: 'Plays song',
    aliases: ['p'],
    cooldown: 5,
    args: true,
    category: 'Music',
    async execute(message, args) {
        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) {
            return message.reply('You need to join a voice channel first!').catch(console.error);
        }
        if (serverQueue && channel !== message.guild.me.voice.channel) {
            return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);
        }

        const search = args.join(' ');
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        // eslint-disable-next-line no-useless-escape
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get('playlist').execute(message, args);
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true,
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                };
            }
            catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }
        else {
            try {
                const results = await yt.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                };
            }
            catch (error) {
                console.error(error);
                return message.reply('No video was found with a matching title').catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            return serverQueue.textChannel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
                .catch(console.error);
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        }
        catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
        }

    },

};