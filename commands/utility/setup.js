const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sends a setting up message'),
        
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
           .setDescription(`Session has reached the appropriate amount of reactions. Please wait as the link is released to Emergency Services, Staff Members, & Nitro Boosters.`)
           .setColor("#ff3b3b");
            await interaction.channel.send({ embeds: [embed] });
 
            await interaction.editReply({ content: 'Command completed successfully', ephemeral: true });
}
};
