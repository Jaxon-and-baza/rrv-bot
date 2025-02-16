const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === 'feedback') {
                const modal = new ModalBuilder()
                    .setCustomId('feedbackModal')
                    .setTitle('Feedback')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('feedbackInput')
                                .setLabel('Host')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('date')
                                .setLabel('Date')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('feedback')
                                .setLabel('Feedback')
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === 'feedbackModal') {
            await interaction.deferReply({ ephemeral: true });

            const feedback = interaction.fields.getTextInputValue('feedback');
            const date = interaction.fields.getTextInputValue('date');
            const host = interaction.fields.getTextInputValue('feedbackInput');

            const targetChannelId = '1340617000556429403';

            const embed = new EmbedBuilder()
                .setDescription(`**Rater:**<@${interaction.user.id}>\n**Host:** ${host}\n**Date:** ${date}\n**Feedback:** ${feedback}`)
                .setColor("#ff3b3b");

            const targetChannel = interaction.client.channels.cache.get(targetChannelId);
            await targetChannel.send({ embeds: [embed] });

            const embed2 = new EmbedBuilder()
                .setDescription('Feedback submitted successfully.')
                .setColor("#ff3b3b");

            await interaction.editReply({ embeds: [embed2] });
        }
    }
};
