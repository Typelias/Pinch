const { canModifyQueue } = require('../utils/pinch-util');

module.exports = {
    name: 'loop',
    aliases: ['l'],
    description: 'Toggle music loop',
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

        queue.loop = !queue.loop;
        return queue.textChannel.send(`Loop is now ${queue.loop ? '**on**' : '**off**'}`).catch(console.error);
    },

};