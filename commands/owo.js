const Discord = require('discord.js');
const http = require('http');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    name: 'OwO',
    description: 'Just try it',
    aliases: ['owo'],
    cooldown: 1,
    category: 'Special',
    args: true,
    execute(message, args) {
        const text = args.join(' ');
        neko.sfw.OwOify({ text: text }).then(resp => {
            message.channel.send(resp.owo);
        });

    },
};