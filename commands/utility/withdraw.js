const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw a specified amount from your balance.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount you wish to withdraw')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    try {
      const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
      const guildID = interaction.guild.id;

      // Fetch the user's balance (cash and bank)
      const userBalance = await unbClient.getUserBalance(guildID, userId);

      // Check if the user has enough money in the bank
      if (userBalance.bank < amount) {
        return interaction.reply({
          content: 'You do not have enough money in your bank account to withdraw this amount.',
          ephemeral: true,
        });
      }

      // Withdraw amount: subtract from bank and add to cash
      const newBankBalance = userBalance.bank - amount;
      const newCashBalance = userBalance.cash + amount;

      // Update the user's bank and cash balances
      await unbClient.editUserBalance(guildID, userId, { 
        cash: newCashBalance,  // Add to cash
        bank: newBankBalance    // Subtract from bank
      });

      const successEmbed = new EmbedBuilder()
        .setDescription(
          `**Withdrawal of ${amount} from your bank account was successful!**\n` +
          `**New Bank Balance**: ${newBankBalance}\n` +
          `**New Cash Balance**: ${newCashBalance}`
        )
        .setColor("#ff3b3b");

      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error('Error withdrawing balance:', error);
      return interaction.reply({
        content: 'Failed to withdraw balance. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
