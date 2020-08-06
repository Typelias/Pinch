const Discord = require('discord.js');
const http = require('http');

const subreddit = 'transformers';

module.exports = {
    name: 'tf',
    description: 'Stuff from r/transformers',
    aliases: ['TF'],
    cooldown: 1,
    category: 'Special',
    execute(message, args) {
        const ret = new Discord.MessageEmbed();
        ret.setColor('#FFC520');
        ret.setTitle('Transform and roll out');
        ret.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');
        http.get('http://192.168.1.111:8080/subreddit/' + subreddit, (resp => {
            let data = '';

            resp.on('data', (chunck) => data += chunck);
            resp.on('end', () => {
                if (data.endsWith('png') || data.endsWith('jpg') || data.endsWith('gif') || data.endsWith('jpeg')) {
                    ret.setImage(data);
                    return message.channel.send(ret);
                }
                else {
                    return message.channel.send(data);
                }

            });
        }));
    },
};