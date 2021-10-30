const userModel = require("@models/userSchema");
const guildConfigModel = require("@models/guildConfigSchema");
const { Log } = require("@root/logSystem");

module.exports = async (interaction, client) => {
	let guildConfig = await guildConfigModel.fetchGuildConfig(interaction.guildId);										//Retreive guild options
	let userData = await userModel.fetchUser(interaction.user.id);														//Fetch user

	if (interaction.isCommand()) {																						//Slash commands
		const command = client.commands.get(interaction.commandName);													//Fetch command
		if (!command) return;																							//Command doesn't exist, return

		//Execute command
		try {
			await command.do(interaction, [], userData, true);
		} catch (err) {
			Log.warn(err, message);
			await interaction.reply("An error occured, a crash report has been sent to the developers!");
		}

	} else if (interaction.isButton()) {																				//Buttons

	} else if (interaction.isSelectMenu()) {																			//Select menus

	}
}