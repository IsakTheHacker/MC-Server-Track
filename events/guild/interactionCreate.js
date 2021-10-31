const userModel = require("@models/userSchema");
const guildConfigModel = require("@models/guildConfigSchema");
const { Log } = require("@root/logSystem");
const { calculateCooldown } = require("@root/cooldownSystem");
const { reloadCommands } = require("@root/handyFunctions");

module.exports = async (interaction, client) => {
	let guildConfig = await guildConfigModel.fetchGuildConfig(interaction.guildId);										//Retreive guild options
	let userData = await userModel.fetchUser(interaction.user.id);														//Fetch user

	if (interaction.isCommand()) {																						//Slash commands
		await reloadCommands(client, interaction.commandName);															//Reloads commands automatically if bot is running in debug mode
		const command = client.commands.get(interaction.commandName);													//Fetch command
		if (!command) return;																							//Command doesn't exist, return
		if (!command.enabled) return await Log.dcReply(interaction, `The \`${command.name}\` command is disabled!`);	//Check if command is enabled

		let newMessage = await calculateCooldown(command, interaction);
		if (!newMessage) return;

		//Execute command
		try {
			await command.do(newMessage, [], userData);
		} catch (err) {
			Log.warn(err, interaction);
			await Log.dcReply(newMessage, "An error occured, a crash report has been sent to the developers!");
		}
	} else if (interaction.isButton()) {																				//Buttons

	} else if (interaction.isSelectMenu()) {																			//Select menus

	}
}
