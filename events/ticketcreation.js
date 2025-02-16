const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1340552727968743456'; 

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'supportOptions') {
                const selectedValue = interaction.values[0];

                if (selectedValue === 'st') {
                    const modal = new ModalBuilder()
                        .setCustomId('ticketReasonModal')
                        .setTitle('Ticket Reason');

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for the ticket')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const row = new ActionRowBuilder().addComponents(reasonInput);
                    modal.addComponents(row);

                    await interaction.showModal(modal);
                    return;
                }

                if (selectedValue === 'mr') {
                    const modal = new ModalBuilder()
                        .setCustomId('bpModal')
                        .setTitle('Member Report');

                    const memberInput = new TextInputBuilder()
                        .setCustomId('memberInput')
                        .setLabel('Member Reporting')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Enter the member\'s name or ID...')
                        .setRequired(true);

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for report')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const proofInput = new TextInputBuilder()
                        .setCustomId('proofInput')
                        .setLabel('Proof (if any)')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Provide any proof here...')
                        .setRequired(false);

                    const row1 = new ActionRowBuilder().addComponents(memberInput);
                    const row2 = new ActionRowBuilder().addComponents(reasonInput);
                    const row3 = new ActionRowBuilder().addComponents(proofInput);
                    
                    modal.addComponents(row1, row2, row3);

                    await interaction.showModal(modal);
                    return;
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'bpModal') {
                const member = interaction.fields.getTextInputValue('memberInput');
                const reason = interaction.fields.getTextInputValue('reasonInput');
                const proof = interaction.fields.getTextInputValue('proofInput');

                await interaction.deferReply({ ephemeral: true });

                const purchaseChannel = await interaction.guild.channels.create({
                    name: `report-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `Ticket Owner: <@${interaction.user.id}>`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1340119038881304588', // Bot Purchase role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const purchaseEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Member Report`)
                .setDescription(
                    `Hello <@${interaction.user.id}>,\n\n` +
                    `Your member report ticket has been successfully opened. Please wait for our High Ranking team to assist you.`
                )
                .addFields(
                    { name: 'Reporter', value: interaction.user.tag, inline: true },
                    { name: 'Member Reported', value: member, inline: true },
                    { name: 'Reason', value: reason },
                    { name: 'Proof', value: proof || 'No proof provided.' }
                )
                .setColor("#ff3b3b");       
            

                const purchaseCloseButton = new ButtonBuilder()
                    .setCustomId('closePurchaseTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await purchaseChannel.send({ content: `<@${interaction.user.id}>, <@&1340119038881304588>`, embeds: [purchaseEmbed], components: [new ActionRowBuilder().addComponents(purchaseCloseButton)] });

                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`A new member report ticket has been opened in <#${purchaseChannel.id}> by <@${interaction.user.id}>.`)
                        .setFields(
                            { name: 'Username', value: `${interaction.user.tag}` },
                            { name: 'Member Reporting', value: member },
                            { name: 'Reason', value: reason },
                            { name: 'Proof', value: proof || 'No proof provided.' }
                        )
                        .setColor("#ff3b3b");

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your ticket has been opened at <#' + purchaseChannel.id + '>.', ephemeral: true });
                return;
            }

            if (interaction.customId === 'ticketReasonModal') {
                const reason = interaction.fields.getTextInputValue('reasonInput');

                await interaction.deferReply({ ephemeral: true });

                const supportChannel = await interaction.guild.channels.create({
                    name: `support-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `Ticket Owner: <@${interaction.user.id}>`, // Store owner info in topic
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1340119045579477072', // Support role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const supportEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} Support Ticket`)
                    .setDescription(`Hello <@${interaction.user.id}>, you have successfully opened a support ticket. Please wait for our Staff team to come help you with your issue.
                        
                        **Username:** ${interaction.user.tag}
                        **Question:** ${reason}
                        
                    __Please wait for our staff team to come and assit you with your ticket.__`)
                    .setColor("#ff3b3b");
            

                const supportCloseButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await supportChannel.send({ content: `<@${interaction.user.id}>, <@&1340119045579477072>`, embeds: [supportEmbed], components: [new ActionRowBuilder().addComponents(supportCloseButton)] });

                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setDescription(`A new support ticket has been opened in <#${supportChannel.id}> by <@${interaction.user.id}>.`)
                        .setFields(
                            { name: 'Question', value: reason }
                        )
                        .setColor("#ff3b3b");
                
                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your support ticket has been opened at <#' + supportChannel.id + '>.', ephemeral: true });
                return;
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'closeTicket' || interaction.customId === 'closePurchaseTicket') {
                const confirmationEmbed = new EmbedBuilder()
                    .setDescription('Are you sure you want to close this ticket?')
                    .setColor("#ff3b3b");
            

                const finalCloseButton = new ButtonBuilder()
                    .setCustomId('confirmClose')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Danger);

                await interaction.reply({ embeds: [confirmationEmbed], components: [new ActionRowBuilder().addComponents(finalCloseButton)], ephemeral: true });
                return;
            }

            if (interaction.customId === 'confirmClose') {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (!logChannel) {
                    console.error('Log channel not found!');
                    return interaction.reply({ content: 'Log channel not found. Please inform an administrator.', ephemeral: true });
                }
            
                const closingEmbed = new EmbedBuilder()
                    .setDescription('Closing in 3 seconds...')
                    .setColor("#ff3b3b");
            
            
                await interaction.reply({ embeds: [closingEmbed], ephemeral: true });
            
                // Wait 3 seconds before closing the ticket
                await new Promise(resolve => setTimeout(resolve, 3000));
            
                const ticketChannel = interaction.channel;
            
                const ticketOwnerId = ticketChannel.topic?.match(/Ticket Owner: <@(\d+)>/)?.[1];
                const ticketOwner = ticketOwnerId ? interaction.guild.members.cache.get(ticketOwnerId) : null;
            
                const transcriptAttachment = await discordTranscripts.createTranscript(ticketChannel, {
                    limit: 200000,
                    returnType: 'attachment',
                    filename: `${ticketOwnerId}.html`,
                    saveImages: true,
                    poweredBy: false,
                    hydrate: true,
                    filter: (message) => true
                });
            
                const closeEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription(`Hello <@${ticketOwnerId}>, your ticket has been successfully closed by <@${interaction.user.id}>. We hope our team was able to resolve your issue.`)
                    .addFields(
                        { name: 'Closed by', value: `<@${interaction.user.id}>` },
                        { name: 'Ticket ID', value: ticketChannel.id },
                        { name: 'Open Date', value: `<t:${Math.floor(ticketChannel.createdTimestamp / 1000)}:F>` },
                        { name: 'Close Date', value: `<t:${Math.floor(interaction.createdTimestamp / 1000)}:F>` },
                    )
                    .setColor("#ff3b3b");
            
            
                const closelogembed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription(`<@${ticketOwnerId}> has been closed by <@${interaction.user.id}>.
            
                        Open time: <t:${Math.floor(ticketChannel.createdTimestamp / 1000)}:F>
                        Close Time: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>
                        Ticket ID: ${ticketChannel.id}`)
                        .setColor("#ff3b3b");
            
                await logChannel.send({ embeds: [closelogembed], files: [transcriptAttachment] });
            
                if (ticketOwner) {
                    await ticketOwner.send({ embeds: [closeEmbed], files: [transcriptAttachment] }).catch(() => {
                        console.log(`Failed to send transcript to ${ticketOwner.user.tag}.`);
                    });
                }
            
                await ticketChannel.delete();
            }
        }
    }
};