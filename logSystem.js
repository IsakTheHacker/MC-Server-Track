const Discord = require("discord.js");

class Log {
	static client = null;
	static logChannel = null;
	static yellow = "#ffd500";
	static red = "#cf2525";
	static gray = "#1f1f1f";

	static configure(client, logChannel) {
		this.client = client;
		this.logChannel = logChannel;
	}

	static isInteraction(messageOrInteraction) {
		if (messageOrInteraction.commandName) {
			return true;
		} else {
			return false;
		}
	}

	static dcReply(messageOrInteraction, data) {
		if (!messageOrInteraction) return;
		if (messageOrInteraction.commandName) {					//Reply to the interaction
			if (messageOrInteraction.replied) {
				return messageOrInteraction.editReply(data);
			} else {
				return messageOrInteraction.reply(data);
			}
		} else {												//Send as message
			return messageOrInteraction.channel.send(data);
		}
	}

	static error(body, message) {
		this.log(body, message, "error");
	}

	static warn(body, message) {
		this.log(body, message, "warn");
	}

	static log(body, message, type) {
		//Determine importance level and set title and color variable accordingly
		let title = "Log (importance level not set)";
		let color = this.gray;
		switch (type) {
			case ("warn"):
				title = ":warning: Warning";
				color = this.yellow;
				break;
			case ("error"):
				title = ":exclamation: Error";
				color = this.red;
				break;
		}

		//Send error in terminal if log channel is not set
		if(!this.logChannel) {
			return console.log(`\nError channel not set, have you forgot to configure the error channel using Log.configure?\n${body.stack}`);
		}

		//Assemble embed and send it in the configured log channel
		let messageContent = "Message: **none**";
		if (message.content) {
			messageContent = `Message: **${message.content}**`;
		} else {
			messageContent = `Slash command: **${message.commandName}**`
		}

		let channel = this.client.channels.cache.get(this.logChannel);
		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.setDescription(`**${body.name}:** ${body.message}`)
			.addFields(
				{ name: "Call stack", value: `\`\`\`${body.stack}\`\`\`` },
				{ name: "Origin", value: `Guild: **${message.member.guild.name}** (${message.member.guild.id})\nUser: **${message.member.user.tag}** (${message.member.id})\n${messageContent}` }
			);
		return channel.send({ embeds: [embed] });
	}
}

module.exports = { Log };