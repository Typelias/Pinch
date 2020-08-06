const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const axios = require('axios');

let redditList = [
    'pepsi',
    'cats',
    'axolotls',
    'dogpictures',
    'CatGifs',
    'doggifs',
    'aww',
    'cableporn',
    'unixporn',
    'dankmemes',
    'memes',
    'funny',
    'ProgrammerHumor',
    'LinusTechTips',
    'transformers',
    'Unboxtherapy',
    'FoodPorn',
    'Charcuterie',
];

if (fs.existsSync('CustomCommands/extraReddits.txt')) {
    const extraSubbreddit = fs.readFileSync('CustomCommands/extraReddits.txt').toString().split('\n');
    redditList = redditList.concat(extraSubbreddit);
}

async function post() {
    await axios.post('http://192.168.1.111:8080/subreddit', redditList).then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res.data);
    })
        .catch((error) => {
            console.log(error);
        });

}

post();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

if (fs.existsSync('CustomCommands')) {
    const extraCommandFiles = fs.readdirSync('./CustomCommands').filter(file => file.endsWith('.js'));

    for (const file of extraCommandFiles) {
        const command = require(`./CustomCommands/${file}`);

        client.commands.set(command.name, command);
    }
}

const cooldowns = new Discord.Collection();


client.once('ready', () => {
    console.log('Ready!');
    client.user.setStatus('online');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: '?help',
            type: 'WATCHING',
        },
    });
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    console.log(command);

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute the command');
    }
});

client.login(token);