const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./data/config.json');
const client = new Discord.Client();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	if (message.content.toLowerCase() === 'hoi') {
		message.channel.send('Hoi! hoe gaat het?')
	} else if (message.content.toLowerCase() === 'goed' || message.content.toLowerCase() === 'fantastisch' || message.content.toLowerCase() === 'geweldig') {
		message.channel.send('mooizo! met mij gaat het ook goed.')
	}
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();


	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);