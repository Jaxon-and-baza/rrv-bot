const { EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const userId = interaction.customId.split('_')[2];

    if (interaction.customId.startsWith('view_balance_')) {
      try {
        const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
        const guildID = interaction.guild.id;

        const userBalance = await unbClient.getUserBalance(guildID, userId);

        const balanceEmbed = new EmbedBuilder()
          .setTitle('User Balance')
          .setDescription(
            `💰 **Balance for <@${userId}>**:\n**Cash**: ${userBalance.cash}\n**Bank**: ${userBalance.bank}`
          )
          .setColor("#ff3b3b");

        await interaction.reply({ embeds: [balanceEmbed], ephemeral: true });
      } catch (error) {
        console.error('Error fetching balance:', error);
        await interaction.reply({
          content: 'Failed to fetch balance. Please try again later.',
          ephemeral: true,
        });
      }
    }
  },
};
