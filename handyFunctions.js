module.exports = {
    async reloadCommands (client, cmd) {
        const oldCommand = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
        if (process.env.debug && oldCommand) {
            try {
                delete require.cache[require.resolve(`@root/commands/${oldCommand.name}.js`)];		//Delete the old command
                client.commands.delete(oldCommand.name);
    
                const reloadedCommand = require(`@root/commands/${oldCommand.name}.js`);			//Load the new command
                client.commands.set(reloadedCommand.name, reloadedCommand);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
