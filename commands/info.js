const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');
const ms = require("ms");

module.exports = {
	name: "info",
	aliases: [],
	description: "View information about the bot.",
	usage: [],
	perms: [],
	cooldown: 5,
	enabled: true,
	category: "miscellaneous",
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("View information about the bot."),
	async do(message, args, userData) {
		let currentTime = new Date().getTime();
		let restartTime = new Date(currentTime - message.client.uptime);

		let additionalInformation;
		if (process.env.debug) {
			additionalInformation = "This bot is running in debug mode!";
		} else {
			additionalInformation = "No additional information";
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#1f1f1f")
			.setThumbnail(message.client.user.avatarURL())
			.setTitle(`${message.client.user.username}`)
			.addFields(
				{ name: "Statistics", value: `Uptime:  ‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎  ‎  ‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎ **${ms(message.client.uptime)}** (${message.client.uptime} milliseconds)\nLast restart:  ‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  **${restartTime.toLocaleTimeString()}** (${restartTime.toLocaleDateString()})`, inline: true },
				{ name: "Total servers", value: message.client.guilds.cache.size.toString(), inline: true }

			)
			.setFooter(additionalInformation)
			.setTimestamp();
		Log.dcReply(message, { embeds: [embed] });
	}
}
