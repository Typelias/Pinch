const { MessageEmbed, splitMessage, escapeMarkdown } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'Show the current music Queue',
    category: 'Music',
    cooldown: 10,
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) {
            return message.reply('There is nothing playing').catch(console.error);
        }

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        const queueEmbed = new MessageEmbed()
            .setTitle('Pinch Music Queue')
            .setDescription(description)
            .setColor('#FFC520')
            .setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: '\n',
            prepend: '',
            append: '',
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed);
        });

    },
};