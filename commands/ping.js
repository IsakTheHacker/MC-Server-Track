const Discord = require('discord.js');
const mcutil = require("minecraft-server-util");
const nodeHtmlToImage = require('node-html-to-image');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

const colors = [
	"#cf2525",			//Offline
	"#32a852",			//Online
	"#1f1f1f"			//Pinging
]

const titles = [
	":red_circle:   Offline",
	":green_circle:   Online",
	":hourglass_flowing_sand:   Retrieving server status!"
]

module.exports = {
	name: "ping",
	aliases: ["status"],
	description: "Ping Minecraft servers to see if they are online!",
	usage: [],
	perms: [],
	cooldown: 5,
	enabled: true,
	category: "miscellaneous",
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Ping Minecraft servers to see if they are online!")
		.addStringOption((option) => {
			return option.setName("ip-address").setDescription("Specify the IP address to the server you want to ping").setRequired(false)
		}),
	async do(message, args, userData) {
		if (Log.isInteraction(message)) {
			if (message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;
		}
		if (args[0]) {
			const pinging_embed = new Discord.EmbedBuilder()
				.setColor(colors[2])
				.setTitle(titles[2])
				.setDescription(`Pinging ${args[0]}...`);
			let botMessage;
			botMessage = await Log.dcReply(message, { embeds: [pinging_embed], ephemeral: false, fetchReply: true });

			let status;
			try {
				status = await mcutil.status(args[0]);
			} catch (err) {
				status = undefined;
			}

			if (!status) {									//Offline
				const pong_embed = new Discord.EmbedBuilder()
					.setColor(colors[0])
					.setTitle(titles[0])
					.setDescription(`The server is offline. :disappointed_relieved:`)
				botMessage.edit({ embeds: [pong_embed] });
			} else {										//Online
				const motdImage = await nodeHtmlToImage({
					html: status.motd.html.replace(/\n/g, "<br>"),
					encoding: "binary",
					transparent: true,
					selector: "body",
					puppeteerArgs: {
						defaultViewport: {
							width: 300,
							height: 1,
							deviceScaleFactor: 1
						},
						args: [
							"--no-sandbox",
							"--disable-setuid-sandbox",
							"--disable-gpu"
						],
						ignoreDefaultArgs: [
							"--disable-extensions"
						],
						headless: false
					}
				});
				const favicon = Buffer.from(status.favicon.split(",").slice(1).join(","), "base64");

				const pong_embed = new Discord.EmbedBuilder()
					.setColor(colors[1])
					.setTitle(titles[1])
					.addFields(
						{ name: "Host", value: `IP-address:  ‎ ‎‏‏‎‏‏‎ ‎ ${status.srvRecord.host}\nPort:‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎  ‎ ‎‏‏‎‏‏‎ ‎ ‎ ‎ ‎‏‏‎‏‏‎ ${status.srvRecord.port}\nDelay:‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎ ‎‏‏‎‏‏‎  ‎ ‎‏‏‎‏‏‎ ‎ ‎${Date.now() - botMessage.createdTimestamp} ms` },
						{ name: "Players", value: `${status.players.online}/${status.players.max} (${(status.players.online / status.players.max * 100).toFixed(0)}% full)` },
						{ name: "Version", value: status.version.name },
					)
					.setThumbnail("attachment://favicon.png")
					.setImage("attachment://motd.png");
				botMessage.edit({ embeds: [pong_embed], files: [
					{ attachment: motdImage, name: "motd.png" },
					{ attachment: favicon, name: "favicon.png" }
				] });
			}
		} else {
			const pinging_embed = new Discord.EmbedBuilder()
				.setColor("#f54242")
				.setTitle(`:ping_pong:  Ping`)
				.setDescription(`Pinging...`);
			let botMessage;
			botMessage = await Log.dcReply(message, { embeds: [pinging_embed], ephemeral: false, fetchReply: true });
			const pong_embed = new Discord.EmbedBuilder()
				.setColor("#f54242")
				.setTitle(`:ping_pong:  Pong`)
				.setDescription(`Took ${botMessage.createdTimestamp - message.createdTimestamp} milliseconds!`)
			botMessage.edit({ embeds: [pong_embed] });
		}
	}
}
