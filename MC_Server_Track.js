const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
require('dotenv').config();
require('module-alias/register');
const { initWebserver } = require("./handyFunctions");

const client = new Client({
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
	],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildPresences,
	]
});

const { Log } = require("@root/logSystem");
Log.configure(client, process.env.logchannel);

const token = process.env.token;

console.log(`Node version: ${process.version}`)
initWebserver(client);	//Start a web server

client.commands = new Collection();

["command_handler", "event_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client);
});

client.login(token).catch((err) => {
	console.log("That's an invalid token I fear :(");
	process.exit(1);
});
