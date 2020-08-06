const { play } = require('../utils/play');
const Discord = require('discord.js');

module.exports = {
    name: 'fbi',
    description: 'SÄPO ÖPPNA DÖRREN',
    aliases: ['FBI'],
    cooldown: 5,
    category: 'Sound Board',
    async execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle('Knackelibang på Säpo');
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        ret.attachFiles('Pictures/FBI.png');
        ret.setImage('attachment://FBI.png');

        message.channel.send(ret);


        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) {
            return;
        }
        if (serverQueue && channel !== message.guild.me.voice.channel) {
            return;
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

        const song = {
            title: 'Big Säpo energy',
            url: 'Sounds/fbi.mp3',
            duration: '4',
        };

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