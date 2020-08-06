const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'shuffle',
    aliases: [],
    description: 'Shuffle the queue',
    category: 'Music',
    cooldown: 10,
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) {
            return message.reply('There is nothing playing').catch(console.error);
        }
        if (!canModifyQueue(message.member)) {
            return;
        }

        const songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            const j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).catch(console.error);
    },
};