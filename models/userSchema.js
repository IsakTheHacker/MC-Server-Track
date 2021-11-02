const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	serverIDs: { type: Array, require: true },
	lastMessageTimestamp: { type: Number },
	reminders: { type: Array },
	prefix: { type: String, require: true, default: "mc!" },
});

const model = mongoose.model("user", userSchema);

const fetchUser = async (userID, serverIDs = [], lastMessageTimestamp = null) => {
	let userData = await model.findOne({ userID: userID });
	if (!userData) {
		userData = await model.create({
			userID: userID,
			serverIDs: serverIDs,
			lastMessageTimestamp: lastMessageTimestamp,
			reminders: [],
		});
		await userData.save();
	}
	return userData;
};

const fetchUserFromMessage = async (message) => {
	return fetchUser(message.author.id, message.guild.id, message.createdTimestamp);
};

const fetchUserFromInteraction = async (interaction) => {
	return fetchUser(interaction.user.id, interaction.guildId, interaction.createdTimestamp);
}

module.exports = { userModel: model, fetchUser, fetchUserFromMessage, fetchUserFromInteraction };
