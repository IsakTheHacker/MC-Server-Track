const { Client, Intents, Collection } = require("discord.js");
require('dotenv').config();
require('module-alias/register');

const client = new Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
	]
});

const token = process.env.token;

// functions.initWebserver(client);	//Start a web server

client.commands = new Collection();

["command_handler", "event_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client);
});

client.login(token);
