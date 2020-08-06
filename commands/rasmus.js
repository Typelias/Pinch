const Discord = require('discord.js');
const http = require('http');


module.exports = {
    name: 'rasmus',
    description: 'Prints nice picture of ICA',
    aliases: ['ica'],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {

        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle('Look at that fine store');
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');

        ret.attachFiles('Pictures/ica.jpg');
        ret.setImage('attachment://ica.jpg');

        return message.channel.send(ret);

    },
};