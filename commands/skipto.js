const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'skipto',
    aliases: ['st'],
    description: 'Skip to a specific song',
    category: 'Music',
    cooldown: 10,
    args: true,
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) {
            return message.reply('There is nothing playing').catch(console.error);
        }
        if (!canModifyQueue(message.member)) {
            return;
        }

        if (isNaN(args[0])) {
            return message.reply(`Usage: ${message.client.prefix}remove <Queue Number>`);
        }

        if (queue.songs.length < args[0]) {
            return message.reply('Index provided is larger than the queue');
        }

        queue.playing = true;
        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        }
        else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ skipped ${args[0] - 1} songs`).catch(console.error);
    },
};