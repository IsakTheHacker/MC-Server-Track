const Discord = require("discord.js");
const { Log } = require("./logSystem");

const cooldowns = new Map();

module.exports = {
	async calculateCooldown(command, messageOrInteraction) {
		return new Promise((resolve, reject) => {
			if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());							//Add command to cooldown map if not present
			
			const timeStamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown) * 1000;
			
			if (timeStamps.has(messageOrInteraction.member.id)) {																//If user has cooldown
				const expirationTime = timeStamps.get(messageOrInteraction.member.id) + cooldownAmount;
			
				if (Date.now() < expirationTime) {
					let message;
					const intervalId = setInterval(async () => {
						let timeLeft = (expirationTime - Date.now()) / 1000;
						if (Date.now() >= expirationTime) {
							if (message) {
								if (message.editedTimestamp) {
									message.createdTimestamp = message.editedTimestamp;
								}
								message.delete();
							}
							clearInterval(intervalId);
							resolve(message);
						}

						let secondOrSeconds = "seconds";
						if (timeLeft.toFixed(0) == 1) {
							secondOrSeconds = "second";
						}

						if (!message && Date.now() < expirationTime) {
							message = await Log.dcReply(messageOrInteraction, { content: `You're on cooldown for the \`${command.name}\` command. Please wait for \`${timeLeft.toFixed(0)}\` ${secondOrSeconds}!`, ephemeral:false, fetchReply:true });
						} else if (Date.now() < expirationTime) {
							message = await message.edit({ content: `You're on cooldown for the \`${command.name}\` command. Please wait for \`${timeLeft.toFixed(0)}\` ${secondOrSeconds}!`, ephemeral:false, fetchReply:true });
						}
					}, 1000)
				}
			} else {																											//User does not have cooldown
				timeStamps.set(messageOrInteraction.member.id, Date.now());
				setTimeout(() => {
					timeStamps.delete(messageOrInteraction.member.id)															//Delete cooldown
				}, cooldownAmount);

				resolve(messageOrInteraction);
			}
		});
	}
}
