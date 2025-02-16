const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup-msg')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Sends the session startup message with a button'),
    async execute(interaction) {


        const embed1 = new EmbedBuilder()
            .setTitle('Server Startup')
            .setDescription(`Welcome to <#${interaction.channel.id}>. This channel is designated for hosting sessions led by our trained staff to ensure an enjoyable experience for all participants.  

We kindly ask that you refrain from misusing or falsifying reactions during the startup process, as such actions will result in an infraction.`)
                .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340548543198396536/server_startup-RRV.png?ex=67b2c29e&is=67b1711e&hm=d17bcd446189c1c731dd510b5293bb1c7eb550c3cc162dd6acf0bafc72a403a3&")
                .setColor("#ff3b3b");

        const button = new ButtonBuilder()
            .setLabel('Guidelines')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/channels/1124805501381791826/1340119157089243196');

        const button1 = new ButtonBuilder()
            .setCustomId('session_ping')
            .setLabel('Session Ping')
            .setStyle(ButtonStyle.Danger);


        
        const row = new ActionRowBuilder()
            .addComponents( button, button1);

      
        await interaction.channel.send({ embeds: [embed1], components: [row] });

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });
    },
};
