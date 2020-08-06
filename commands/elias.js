const Discord = require('discord.js');
const http = require('http');


module.exports = {
    name: 'elias',
    description: 'This is what you think Elias looks like',
    aliases: ['typelias'],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle('Is this the real Elias');
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        ret.attachFiles('Pictures/elias.png');
        ret.setImage('attachment://elias.png');

        return message.channel.send(ret);

    },
};