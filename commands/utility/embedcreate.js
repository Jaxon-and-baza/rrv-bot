const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create and send an embed to the channel')
        .setDefaultMemberPermissions(8),

    async execute(interaction) {
        try {

            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: 'You lack the permissions to use this command.', ephemeral: true });
            }

            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('workembed') 
                .setTitle('Embed Information')
                .addComponents(

                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel('Embed Description')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                    ),

                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('thumbnail')
                            .setLabel('Thumbnail URL (Optional)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('image')
                            .setLabel('Image URL (Optional)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)

                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('title')
                            .setLabel('Title (Optional)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    )
                );

            await interaction.showModal(modal);
        } catch (error) {
            console.error('Error showing modal:', error);
            await interaction.reply({ content: 'Failed to display the modal. Please try again later.', ephemeral: true });
        }
    },
};
