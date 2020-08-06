const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Skip current song',
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

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
    },
};