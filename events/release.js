const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === "session_link") {
      try {
        const sessionLink = interaction.message.sessionLink;

        if (!sessionLink) {
          const errorEmbed = new EmbedBuilder()
            .setDescription("Session link not found. Please try again later.")
            .setColor("#ff3b3b");
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          return;
        }

        const embed = new EmbedBuilder()
          .setDescription(`${sessionLink}`)
          .setColor("ff3b3b");

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error("Error responding to button interaction:", error);
        await interaction.reply({
          content: "An error occurred while processing the button interaction.",
          ephemeral: true,
        });
      }
    }
  },
};
