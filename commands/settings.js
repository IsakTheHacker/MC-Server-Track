const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

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
					.setCustomId("continue")
					.setEmoji("➡️")
					.setStyle("SECONDARY")
			);

		const embed = new Discord.MessageEmbed()
			.setColor("#1f1f1f")
			.setThumbnail(message.member.user.avatarURL())
			.setTitle(`Change my user settings`)
			.setDescription(`Hi, ${message.member.user.username}! I will help you change your user settings. Press :arrow_right: to continue!`);
		await Log.dcReply(message, { embeds: [embed], ephemeral: true, components: [row], fetchReply: true });

		let n = 0;
		const filter = i => i.customId === "continue" && i.user.id === message.member.id;
		const collector = message.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });

		collector.on("collect", async i => {
			switch (n) {
			case 0:
				const embed = new Discord.MessageEmbed()
					.setColor("#1f1f1f")
					.setTitle(`Change my user settings`)
					.setDescription(`Page 1`);
				await i.update({ embeds: [embed], components: [row] });
				break;
			}
			n++;
		});

		collector.on("end", async (collected) => {
			//Nothing
		});
	}
}
