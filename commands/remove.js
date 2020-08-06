const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'remove',
    aliases: ['r'],
    description: 'Remove song from queue',
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

        const song = queue.songs.splice(args[0] - 1, 1);
        queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
    },
};