const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

module.exports = {
	name: "ping",
	aliases: [],
	description: "Ping the bot!",
	usage: [],
	perms: [],
	cooldown: 5,
	enabled: true,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Ping the bot!"),
	async do(message, args, userData, isInteraction) {
		const pinging_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Ping`)
			.setDescription(`Pinging...`);
		let botMessage;
		botMessage = await Log.dcReply(message, { embeds:[pinging_embed], ephemeral:false, fetchReply:true });

		const pong_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Pong`)
			.setDescription(`Took ${botMessage.createdTimestamp - message.createdTimestamp} milliseconds!`)
		botMessage.edit({ embeds:[pong_embed] });
	}
}
