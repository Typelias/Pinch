const ytdlDiscord = require('ytdl-core-discord');
const ytdl = require('discord-ytdl-core');
const { canModifyQueue } = require('./pinch-util');
const fs = require('fs');
const { resolve } = require('path');

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);

        if (!song) {
            setTimeout(() => {
                if (!queue.connection.dispatcher && message.guild.me.voice.channel) {
                    queue.channel.leave();
                    queue.textChannel.send('I have left the channel. See you again.').catch(console.error);
                }
                else {
                    return;
                }
            }, 600000);
            message.client.queue.delete(message.guild.id);
            return queue.textChannel.send('🚫 Music queue ended.').catch(console.error);
        }

        let stream = null;
        const streamType = song.url.includes('youtube.com') ? 'opus' : 'unknown';

        try {
            if (song.url.includes('youtube.com')) {
                stream = await ytdl(song.url, { filter: "audioonly", opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']});
            }
            else if (song.url.includes('.mp3')) {
                stream = fs.createReadStream(song.url);
            }
        }
        catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }
            console.error(error);
            return message.channel.send(`Error: ${error.message ? error.message : error}`);

        }

        queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection.play(stream, { type: streamType }).on('finish', () => {

            setTimeout(() => {
                if (collector && !collector.ended) collector.stop();

                if (queue.loop) {
                    const lastSong = queue.song.shift();
                    queue.song.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                }
                else {
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                }
            }, 3000);

        }).on('error', (err) => {
            console.log(err);
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
        });


        const playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url.includes('.mp3') ? '' : song.url}`);
        await playingMessage.react('⏭');
        await playingMessage.react('⏯');
        await playingMessage.react('🔁');
        await playingMessage.react('⏹');


        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000,
        });

        collector.on('collect', (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);
            switch (reaction.emoji.name) {
                case '⏭':
                    queue.playing = true;
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return;
                    queue.connection.dispatcher.end();
                    queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error);
                    collector.stop();
                    break;

                case '⏯':
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return;
                    if (queue.playing) {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.pause(true);
                        queue.textChannel.send(`${user} ⏸ paused the music.`).catch(console.error);
                    }
                    else {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.resume();
                        queue.textChannel.send(`${user} ▶ resumed the music!`).catch(console.error);
                    }
                    break;

                case '🔁':
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return;
                    queue.loop = !queue.loop;
                    queue.textChannel.send(`Loop is now ${queue.loop ? '**on**' : '**off**'}`).catch(console.error);
                    break;

                case '⏹':
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return;
                    queue.songs = [];
                    queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error);
                    try {
                        queue.connection.dispatcher.end();
                    }
                    catch (error) {
                        console.error(error);
                        queue.connection.disconnect();
                    }
                    collector.stop();
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });

        collector.on('end', () => {
            playingMessage.reactions.removeAll().catch(console.error);
            if (true && playingMessage && !playingMessage.deleted) {
                playingMessage.delete({ timeout: 3000 }).catch(console.error);
            }

        });
    },
};