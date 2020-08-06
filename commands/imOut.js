const Discord = require('discord.js');
const http = require('http');


module.exports = {
    name: 'imOut',
    description: 'When you need to leave use this',
    aliases: ['immaHeadOut'],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle(`${message.author.username} is out`);
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        ret.attachFiles('Pictures/out.jpg');
        ret.setImage('attachment://out.jpg');

        return message.channel.send(ret);

    },
};