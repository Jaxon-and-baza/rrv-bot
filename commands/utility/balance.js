const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Check your current balance or someone else's.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose balance you want to check.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guildID = interaction.guild.id;

    try {
      const userBalance = await unbClient.getUserBalance(guildID, targetUser.id);
      
      const balanceEmbed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s Balance`)
      .setDescription(
          `**Cash:** ${userBalance.cash}\n` +
          `**Bank:** ${userBalance.bank}`
      )
      .setColor("#ff3b3b");  

      await interaction.reply({ embeds: [balanceEmbed], ephemeral: false });
    } catch (error) {
      console.error("Error fetching balance:", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("❌ Failed to fetch the balance. Please try again later.")
        .setColor("#FF0000");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: false });
    }
  },
};