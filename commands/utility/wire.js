const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wire')
    .setDescription('Wire a specified amount of withdrawn money to another user.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount you wish to give')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('recipient')
        .setDescription('The user you want to give money to')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const recipient = interaction.options.getUser('recipient');
    const amount = interaction.options.getInteger('amount');

    try {
      const unbClient = new Client('your-api-token');
      const guildID = interaction.guild.id;

      const userBalance = await unbClient.getUserBalance(guildID, userId);

      if (userBalance.bank < amount) {
        return interaction.reply({
          content: 'You do not have enough money in your bank account to give this amount.',
          ephemeral: true,
        });
      }

      // Calculate new balances for sender and recipient
      const newUserBankBalance = userBalance.bank - amount;
      const newRecipientBankBalance = userBalance.bank + amount;

      // Update the sender's bank balance (deducting the amount)
      await unbClient.editUserBalance(guildID, userId, { cash: userBalance.cash, bank: newUserBankBalance });

      // Get recipient's balance and update it (adding the amount)
      const recipientBalance = await unbClient.getUserBalance(guildID, recipient.id);
      await unbClient.editUserBalance(guildID, recipient.id, { cash: recipientBalance.cash, bank: newRecipientBankBalance });

      const successEmbed = new EmbedBuilder()
        .setDescription(
          `**You have given ${amount} from your bank account to <@${recipient.id}>.**\n` +
          `**Your New Bank Balance**: ${newUserBankBalance}\n` +
          `**${recipient.username}'s New Bank Balance**: ${newRecipientBankBalance}`
        )
        .setColor("#ff3b3b");

      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error('Error giving money:', error);
      return interaction.reply({
        content: 'Failed to give money. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
