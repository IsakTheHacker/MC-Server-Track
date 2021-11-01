const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');
const ms = require("ms");

module.exports = {
	name: "settings",
	aliases: ["options", "setup"],
	description: "Change user settings",
	usage: [],
	perms: [],
	cooldown: 5,
	enabled: true,
	category: "miscellaneous",
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Change user settings"),
	async do(message, args, userData) {
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId("primary")
					.setLabel("➡️")
					.setStyle("PRIMARY"),
			);

		const embed = new Discord.MessageEmbed()
			.setColor("#1f1f1f")
			.setThumbnail(message.member.user.avatarURL())
			.setTitle(`Change my user settings`)
			.setDescription(`Hi, ${message.member.user.username}! I will help you change your user settings. Press :arrow_right: to continue!`);
		Log.dcReply(message, { embeds: [embed], ephemeral: true, components: [row] });
	}
}
