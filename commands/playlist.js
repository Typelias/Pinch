const { MessageEmbed } = require('discord.js');
const { play } = require('../utils/play');
const { ytKey } = require('../config.json');
const YouTubeAPI = require('simple-youtube-api');
const yt = new YouTubeAPI(ytKey);
module.exports = {
    name: 'playlist',
    description: 'Play a playlist from youtube',
    aliases: ['pl'],
    cooldown: 5,
    args: true,
    category: 'Music',
    async execute(message, args) {
        const { channel } = message.member.voice;
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && channel !== message.guild.me.voice.channel) {
            return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);
        }
        if (!channel) {
            return message.reply('You need to join a voice channel first!').catch(console.error);
        }

        const search = args.join(' ');
        // eslint-disable-next-line no-useless-escape
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true,
        };

        let song = null;
        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await yt.getPlaylist(url, { part: 'snippet' });
                videos = await playlist.getVideos(20, { part: 'snippet' });
            }
            catch (error) {
                console.error(error);
                return message.reply('Playlist not found :(').catch(console.error);
            }
        }
        else {
            try {
                const results = await yt.searchPlaylists(search, 1, { part: 'snippet' });
                playlist = results[0];
                videos = await playlist.getVideos(20, { part: 'snippet' });
            }
            catch (error) {
                console.error(error);
                return message.reply('Playlist not found :(').catch(console.error);
            }
        }

        videos.forEach((video) => {
            song = {
                title: video.title,
                url: video.url,
                duration: video.durationSeconds,
            };

            if (serverQueue) {
                serverQueue.songs.push(song);
            }
            else {
                queueConstruct.songs.push(song);
            }
        });

        const playlistEmbed = new MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setURL(playlist.url)
            .setColor('#FFC520')
            .setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png')
            .setTimestamp();

        playlistEmbed.setDescription(queueConstruct.songs.map((s, index) => `${index + 1}. ${s.title}`));
        if (playlistEmbed.description.length >= 2048) {
            playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + '\nPlaylist larger than character limit...';
        }

        message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

        if (!serverQueue) {
            message.client.queue.set(message.guild.id, queueConstruct);
        }

        if (!serverQueue) {
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
        }

    },
};