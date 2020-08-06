const { prefix } = require('../config.json');
const Discord = require('discord.js');
const { category } = require('./ping');
module.exports = {
    name: 'help',
    description: 'Lists all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => '`' + command.name + '`').join('\n'));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);


            const catagoryMap = new Map();

            for (const value of commands.values()) {
                if (typeof catagoryMap[value.category || 'Other'] === 'undefined') {
                    catagoryMap[value.category || 'Other'] = [];
                    catagoryMap[value.category || 'Other'].push('`' + value.name + ' - ' + value.description + '`');
                }
                else {
                    catagoryMap[value.category || 'Other'].push('`' + value.name + ' - ' + value.description + '`');
                }
            }

            const embed = new Discord.MessageEmbed();
            embed.setColor('#FFC520');
            embed.setTitle('Help was requested');
            embed.setAuthor('Pinch', 'https://cdn.discordapp.com/avatars/676915284707115056/6f271d78c9b0df2c4c553ae39eb98bd1.png');
            embed.setDescription('This message shows all the commands');

            const orderedMap = new Map();

            Object.keys(catagoryMap).sort().forEach((key) => {
                orderedMap[key] = catagoryMap[key];
            });

            Object.keys(orderedMap).forEach((key) => {
                embed.addField(key, orderedMap[key].join('\n'));
            });

            // message.author.send(embed);


            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });

    },
};