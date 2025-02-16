const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the items available in the shop.'),

  async execute(interaction) {
    const comingSoonEmbed = new EmbedBuilder()
      .setTitle('Shop Coming Soon!')
      .setDescription('**The shop is coming soon! Stay tuned for exciting items and features.**')
      .setColor("#ff3b3b");

    return interaction.reply({ embeds: [comingSoonEmbed], ephemeral: true });
  },
};
