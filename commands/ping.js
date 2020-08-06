module.exports = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['prong'],
    cooldown: 20,
    category: 'Fun',
    execute(message, args) {
        message.channel.send('Pong!');
    },
};