const { EmbedBuilder } = require('discord.js');
const Vehicle = require('../models/vehicle');
const Ticket = require('../models/tickets');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const [action, entity, userId] = interaction.customId.split('_');
    const member = interaction.guild.members.cache.get(userId);
    const displayName = member ? member.displayName : interaction.user.username;

    if (action === 'view' && (entity === 'vehicles' || entity === 'tickets')) {
      try {
        const isVehicles = entity === 'vehicles';
        const Model = isVehicles ? Vehicle : Ticket;
        const items = await Model.find({ userId });

        if (items.length === 0) {
          return interaction.reply({ content: `No ${isVehicles ? 'vehicles' : 'tickets'} found for <@${userId}>.`, ephemeral: true });
        }

        const itemList = items
          .map((item, index) => isVehicles
            ? `**${index + 1}.** ${item.year} ${item.make} ${item.model}\nColor: ${item.color}\nNumber Plate: ${item.numberPlate}`
            : `**${index + 1}.** Offense: ${item.offense}\nPrice: ${item.price}\nUnit: ${item.unit}`
          )
          .join('\n\n');

        const embed = new EmbedBuilder()
          .setTitle(`${isVehicles ? 'Registered Vehicles' : 'Current Tickets'} for ${displayName}`)
          .setDescription(itemList)
          .setColor("#ff3b3b");

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: `Error fetching ${entity}. Please try again later.`, ephemeral: true });
      }
    }
  },
};
