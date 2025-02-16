const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Make the bot say something.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have the required permissions to use this command.');
        }

        const text = args.join(' ');
        if (!text) {
            return message.reply('Please provide a message for the bot to say.');
        }

        try {
            await message.channel.send(text);
            await message.delete(); // Delete the command message
        } catch (error) {
            console.error('Error sending message:', error);
            await message.reply('An error occurred while trying to send the message.');
        }
    },
};
