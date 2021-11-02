const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

previousButton = new Discord.MessageButton()
	.setCustomId("previous")
	.setEmoji("⬅️")
	.setStyle("SECONDARY");
previousButtonDisabled = new Discord.MessageButton()
	.setCustomId("previous")
	.setEmoji("⬅️")
	.setStyle("SECONDARY")
	.setDisabled(true);
	
nextButton = new Discord.MessageButton()
	.setCustomId("next")
	.setEmoji("➡️")
	.setStyle("SECONDARY");
nextButtonDisabled = new Discord.MessageButton()
	.setCustomId("next")
	.setEmoji("➡️")
	.setStyle("SECONDARY")
	.setDisabled(true);

const row0 = new Discord.MessageActionRow()
	.addComponents(
		previousButtonDisabled,
		nextButton
	);
const row1 = new Discord.MessageActionRow()
	.addComponents(
		previousButton,
		nextButton
	);
const row2 = new Discord.MessageActionRow()
	.addComponents(
		previousButton,
		nextButtonDisabled
	);

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
		let n = 0;
		const startEmbed = new Discord.MessageEmbed()
			.setColor("#1f1f1f")
			.setThumbnail(message.member.user.avatarURL())
			.setTitle(`Change my user settings`)
			.setDescription(`Hi, ${message.member.user.username}! I will help you change your user settings. Press :arrow_right: to continue!`)
			.setFooter(`Page ${n}`);
		await Log.dcReply(message, { embeds: [startEmbed], ephemeral: true, components: [row0], fetchReply: true });

		const filter = i => i.user.id === message.member.id;
		const collector = message.channel.createMessageComponentCollector({ componentType: "BUTTON" });
		
		collector.on("collect", async i => {
			if (i.customId === "next") {
				n++;
			} else {
				n--;
			}
			switch (n) {
				case 0:
					await i.update({ embeds: [startEmbed], components: [row0] });
					break;
				case 1:
					const embed = new Discord.MessageEmbed()
						.setColor("#1f1f1f")
						.setTitle(`Change my user settings`)
						.setDescription(`Here you can change your personal bot prefix that you'll use when you communicate with the bot.`)
						.addFields(
							{ name: "Current bot prefix", value: userData.prefix }
						)
						.setFooter(`Page ${n}`);
					await i.update({ embeds: [embed], components: [row1] });
					break;
			}
		});

		collector.on("end", async (collected) => {
			console.log("end");
		});
	}
}
