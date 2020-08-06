const Discord = require('discord.js');
const http = require('http');


module.exports = {
    name: 'noU',
    description: 'When you dont have comeback',
    aliases: ['reverse'],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }));

        ret.attachFiles('Pictures/nou.png');
        ret.setImage('attachment://nou.png');

        return message.channel.send(ret);

    },
};