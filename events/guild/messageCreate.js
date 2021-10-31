const userModel = require("@models/userSchema");
const guildConfigModel = require("@models/guildConfigSchema");
const { Log } = require("@root/logSystem");
const { calculateCooldown } = require("@root/cooldownSystem");
const { reloadCommands } = require("@root/handyFunctions");

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
	if (!command) return;																								//Command doesn't exist, return
	if (!command.enabled) return await message.channel.send(`The \`${command.name}\` command is disabled!`);			//Check if command is enabled

	let newMessage = await calculateCooldown(command, message);
	if (!newMessage) return;

	//Execute command
	try {
		await command.do(newMessage, args, userData);
	} catch (err) {
		Log.warn(err, message);
		await message.channel.send("An error occured, a crash report has been sent to the developers!");
	}
}
