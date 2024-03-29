const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Log } = require('@root/logSystem');

module.exports = {
	name: "help",
	aliases: [],
	description: "Get help with bot commands!",
	usage: [
		"help",
		"help <command>"
	],
	perms: [],
	cooldown: 0,
	enabled: true,
	category: "miscellaneous",
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get help with bot commands!")
		.addStringOption((option) => {
			return option.setName("specfic").setDescription("Specify the command you want to get information about").setRequired(false)
		}),
	async do(message, args, userData) {
		if (Log.isInteraction(message)) {
			if (message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;	
		}
		if (args[0]) {
			Log.dcReply(message, { embeds:[getSpecificCmd(message.client, args[0])] });
		} else {
			Log.dcReply(message, { embeds:[getAllCmds(message.client)] });
		}
	}
}

function getAllCmds(client) {
	let categories = [];
	client.commands.map(cmd => cmd.category).forEach(element => {
		if (!categories.includes(element)) {
			categories.push(element);
		}
	});
	let fields = [];
	categories.forEach(element => {
		fields.push({ name: capitalize(element), value: client.commands.filter(e => e.category === element).map(cmd => cmd.name).join("\n") })
	})
	const embed = new Discord.EmbedBuilder()
		.setColor("#f54242")
		.setTitle(`Help`)
		.setDescription(`Showing list of commands`)
		.addFields(
			fields
		)
	return embed;
}

function getSpecificCmd(client, input) {
	const cmd = client.commands.get(input.toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(input.toLowerCase()));

	if (!cmd) {
		return "The command couldn't be found!";
	} else {
		let aliases = cmd.aliases.join(", ");
		if (!aliases) {
			aliases = "none";
		}
		let usages = `\`\`\`` + cmd.usage.join("\n") + `\`\`\``;
		if (!cmd.usage.join("\n")) {
			usages = "usage not defined";
		}
		
		let fields = [
			{ name: "Description", value: cmd.description },
			{ name: "Alias", value: aliases },
			{ name: "Usage", value: usages }
		]
		const embed = new Discord.EmbedBuilder()
			.setColor("#f54242")
			.setTitle(`${cmd.name} - Help`)
			.setDescription(`Showing information about the *${cmd.name}* command`)
			.addFields(
				fields
			)
		return embed;
	}
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
