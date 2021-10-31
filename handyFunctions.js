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
    },
    initWebserver(client) {
		const express = require('express');
		const app = express();
		const port = 3000;

		app.get('/', (req, res) => {
			res.send(`
				<img src=${client.user.avatarURL()}>
				This webpage is served as a test page to see if the bot is up and running!
			`);
		});
		app.listen(port, () => console.log(`Webserver listening at http://localhost:${port}`)).on("error", (err) => {
			console.log(`Failed to open web server with code: "${err.code}"`);
		});
	}
}
