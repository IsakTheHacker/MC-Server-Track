const Discord = require('discord.js');
const mcutil = require("minecraft-server-util");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

module.exports = {
	name: "track",
	aliases: [],
	description: "Track the uptime of your favorite Minecraft servers and get notified when they go offline/online.",
	usage: ["track <server ip>"],
	perms: [],
	cooldown: 0,
	enabled: true,
	category: "miscellaneous",
	data: new SlashCommandBuilder()
		.setName("track")
		.setDescription("Track the uptime of your favorite Minecraft servers and get notified when they go offline/online.")
		.addStringOption((option) => {
			return option.setName("ip-address").setDescription("Specify the IP address to the server you want to track").setRequired(false)
		}),
	async do(message, args, userData) {
		if (Log.isInteraction(message)) {
			if (message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;
		}
		if (!args[0]) Log.dcReply(message, "Please specify the server address you want to setup a tracker for!");
		
		let status;
		let lastStatus;
		setInterval(async () => {
			if (!status && lastStatus == "online") {
				message.member.user.send(`\`${args[0]}\` went offline`);
			} else if (status && lastStatus == "offline") {
				message.member.user.send(`\`${args[0]}\` went online`);
			}
			try {
				status = await mcutil.status(args[0]);
				lastStatus = "online";
			} catch (err) {
				status = undefined;
				lastStatus = "offline";
			}
		}, 5000);

		const embed = new Discord.MessageEmbed()
			.setColor("#1f1f1f")
			.setTitle("Added a new tracker")
			.setDescription(`I have set up a tracker for the server at \`${args[0]}\``)
		Log.dcReply(message, { embeds: [embed] });
	}
}
