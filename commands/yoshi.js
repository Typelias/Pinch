const Discord = require('discord.js');
const http = require('http');


module.exports = {
    name: 'yoshi',
    description: 'Prints nice picture of ICA',
    aliases: [],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle('That do be a nice car');
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        ret.attachFiles('Pictures/yoshi.jpg');
        ret.setImage('attachment://yoshi.jpg');

        return message.channel.send(ret);

    },
};