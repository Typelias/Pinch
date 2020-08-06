const createBar = require('string-progressbar');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'np',
    aliases: ['nowPlaying', 'nowplaying'],
    description: 'Show current playing song',
    category: 'Music',
    cooldown: 10,
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) {
            return message.reply('There is nothing playing').catch(console.error);
        }
        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;
        const nowPlaying = new MessageEmbed()
            .setTitle('Now playing')
            .setDescription(`${song.title}\n${song.url}`)
            .setColor('#FFC520')
            .setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png')
            .addField('\u200b', new Date(seek * 1000).toISOString().substr(11, 8) + '[' + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + ']' + (song.duration == 0 ? ' ◉ LIVE' : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
        if (song.duration > 0) {
            nowPlaying.setFooter('Time Remaining: ' + new Date(left * 1000).toISOString().substr(11, 8));
        }

        return message.channel.send(nowPlaying);
    },
};