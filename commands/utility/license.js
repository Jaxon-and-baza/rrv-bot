// commands/utility/license.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const License = require('../../models/license'); // Import the License model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('license')
        .setDescription('Set the license status for a specific user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose license status you want to set.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The license status (valid or not valid) ')
                .setRequired(true)
                .addChoices(
                    { name: 'Valid', value: 'Valid' },
                    { name: 'Invalid', value: 'Invalid' })),

    async execute(interaction) {
        const allowedRoleIds = ['1340119046523191410', '1340119048150847590'];
        const hasAdminRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasAdminRole) {
            const embed = new EmbedBuilder()
                .setDescription('You do not have permission to set the license status.')
                .setColor("#ff3b3b");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const status = interaction.options.getString('status');
        const userId = user.id;

        try {
        
            let license = await License.findOne({ userId });

            if (license) {

                license.status = status;
                license.date = new Date();
                await license.save();
            } else {
        
                license = new License({ userId, status, date: new Date() });
                await license.save();
            }

            await interaction.reply({ content: `License status for <@${userId}> has been set to ${status}.`, ephemeral: true });

        } catch (error) {
            console.error('An error occurred while setting the license status:', error);
            await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    },
};
