const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cohost')
        .setDescription('Sends a cohost message'),
        
        async execute(interaction) {

            const requiredRoleId = '1340119045579477072';
            if (!interaction.member.roles.cache.has(requiredRoleId)) {
                return interaction.reply({
                    content: "You do not have permission to use this command.",
                    ephemeral: true
                });
            }
            await interaction.deferReply({ ephemeral: true });

            const embed = new EmbedBuilder()
            .setDescription(`<@${interaction.user.id}> is Cohosting this session!.`)
            .setColor("#ff3b3b");

            await interaction.channel.send({ embeds: [embed] });
 
            await interaction.editReply({ content: 'Command completed successfully', ephemeral: true });
}
};
