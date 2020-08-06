const { play } = require('../utils/play');

module.exports = {
    name: 'astro',
    description: 'When the coffin goes out',
    aliases: [],
    cooldown: 5,
    category: 'Sound Board',
    async execute(message, args) {
        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) {
            return message.reply('You need to join a voice channel first!').catch(console.error);
        }
        if (serverQueue && channel !== message.guild.me.voice.channel) {
            return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);
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
            title: 'Dancing Coffin',
            url: 'Sounds/astro.mp3',
            duration: '9',
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