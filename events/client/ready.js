const mongoose = require("mongoose");
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const profileModel = require("@models/userSchema");

module.exports = (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	mongoose.set('strictQuery', true);
	mongoose.connect(process.env.mongodb_srv, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(async () => {
		console.log("Connected to the database!");

		//Register slash commands
		const rest = new REST({
			version: "9"
		}).setToken(process.env.token);
		(async () => {
			try {
				process.stdout.write("Start to register slash commands... ");

				client.guilds.cache.forEach(async guild => {
					await rest.put(
						Routes.applicationGuildCommands(client.user.id, guild.id), { body: client.commandArray }
					)
				});

				console.log("Done!");
			} catch (err) {
				console.log("Error:");
				console.log(err)
			}
		})();

	}).catch((err) => {
		console.log(process.env.mongodb_srv);
		console.log(err);
	});
}
