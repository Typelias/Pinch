const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'stop',
    aliases: ['l'],
    description: 'Stops the music and removes the queue',
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

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
    },
};