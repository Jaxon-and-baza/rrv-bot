const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Purge a specified number of messages (admins only).',
  async execute(message, args) {
    // Check if the user has admin permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need admin permissions to use this command.');
    }

    // Get the number of messages to delete
    const amount = parseInt(args[0]);

    // Validate the amount of messages specified
    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return message.reply('Please specify a valid number of messages to delete (1-100).');
    }

    // Adjust the amount by adding 1 to delete one extra message
    const deleteCount = amount + 1;

    try {
      // Fetch the messages
      const messages = await message.channel.messages.fetch({ limit: deleteCount });

      // Filter out pinned messages
      const messagesToDelete = messages.filter(msg => !msg.pinned);

      // Delete the messages
      await message.channel.bulkDelete(messagesToDelete);

      // Send a confirmation message without replying to a message
      message.channel.send(`Successfully deleted ${messagesToDelete.size} messages.`);
    } catch (error) {
      // If it's a different error, log it to the console
      console.error('Error in purge command:', error);
      message.reply('An error occurred while trying to purge messages.');
    }
  }
};
