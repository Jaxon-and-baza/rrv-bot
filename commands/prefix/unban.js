const { Client, CommandInteraction, Message } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a member from the server",
  async execute(message, args) {
    // Check if the user has permission to unban members
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to unban members.");
    }

    // Get the user ID to unban
    const userId = args[0];
    if (!userId) {
      return message.reply("Please provide the user ID to unban.");
    }

    try {
      // Fetch the user to unban
      const user = await message.guild.bans.fetch(userId);

      // Unban the user
      await message.guild.members.unban(user.user, "Unbanned by command");

      message.channel.send(`${user.user.tag} has been unbanned.`);
    } catch (error) {
      console.error(error);
      return message.channel.send("An error occurred while trying to unban this user.");
    }
  },
};
