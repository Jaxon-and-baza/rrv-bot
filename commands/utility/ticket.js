const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../../models/tickets'); // Assuming you have a ticket model to store tickets

module.exports = {
  data: new SlashCommandBuilder()
    .setName('issue_ticket')
    .setDescription('Issue a fine to a user.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to issue the ticket to.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('offense')
        .setDescription('The offense committed by the user.')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('price')
        .setDescription('The price of the fine.')
        .setRequired(true)),

  async execute(interaction) {
    // Check if the user has the proper role to issue tickets
    const officerRoles = ['1340119046523191410', '1340119048150847590'];
    const memberRoles = interaction.member.roles.cache.map(role => role.id);

    if (!officerRoles.some(roleId => memberRoles.includes(roleId))) {
      return interaction.reply({ content: 'You do not have permission to issue tickets.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const offense = interaction.options.getString('offense');
    const price = interaction.options.getNumber('price');
    const officerId = interaction.user.id;

    try {
      const newTicket = new Ticket({
        userId: user.id,
        offense,
        price,
        officerId,
      });

      await newTicket.save();

      const embed = new EmbedBuilder()
        .setDescription(`You have successfully issued a ticket to <@${user.id}>.`)
        .addFields(
          { name: 'Offense', value: offense },
          { name: 'Fine Price', value: `$${price}` },
          { name: 'Issued By', value: `<@${officerId}>` }
        )
        .setColor("#ff3b3b");
      await interaction.reply({ embeds: [embed] });

      const userEmbed = new EmbedBuilder()
        .setDescription(`You have received a fine for the offense: **${offense}**.`)
        .addFields(
          { name: 'Offense', value: offense },
          { name: 'Fine Price', value: `$${price}` },
          { name: 'Issued By', value: `<@${officerId}>` }
        )
        .setColor("#ff3b3b");

      await user.send({ embeds: [userEmbed] });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error issuing the ticket. Please try again later.', ephemeral: true });
    }
  },
};
