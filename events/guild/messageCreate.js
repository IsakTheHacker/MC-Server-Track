const userModel = require("@models/userSchema");
const guildConfigModel = require("@models/guildConfigSchema");
const { Log } = require("@root/logSystem");
const { calculateCooldown } = require("@root/cooldownSystem");

module.exports = async (message, client) => {
	if (message.author.bot) return;																						//Don't accept messages from bots
	if (message.channel.type == "dm") return;																			//Don't accept dms

	let guildConfig = await guildConfigModel.fetchGuildConfig(message.guild.id);										//Retreive guild options
	let userData = await userModel.fetchUserFromMessage(message);														//Fetch user
	userData.lastMessageTimestamp = message.createdTimestamp;

	const prefix = guildConfig.prefix;
	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	if (!message.content.startsWith(prefix)) return;																	//Require prefix

	await reloadCommands(client, cmd);																					//Reloads commands automatically if bot is running in debug mode
	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));		//Fetch command
	if (!command) return;

	let newMessage = await calculateCooldown(command, message);
	if (!newMessage) return;

	//Execute command
	if (command.enabled) {
		try {
			await command.do(newMessage, args, userData);
		} catch (err) {
			Log.warn(err, message);
			await message.channel.send("An error occured, a crash report has been sent to the developers!");
		}
	} else {
		await message.channel.send(`The \`${command.name}\` command is disabled!`);
	}
}

reloadCommands = async (client, cmd) => {
	if (process.env.debug && (client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd)))) {
		try {
			delete require.cache[require.resolve(`@root/commands/${cmd}.js`)];
			client.commands.delete(cmd);
			const pull = require(`@root/commands/${cmd}.js`);
			client.commands.set(cmd, pull);
		} catch (err) {
			console.log(err);
		}
	}
}
