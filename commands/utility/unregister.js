
const { SlashCommandBuilder } = require('discord.js');
const Vehicle = require('../../models/vehicle'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('Unregister a vehicle.')
        .addStringOption(option =>
            option.setName('brand')
                .setDescription('The brand (make) of the vehicle to unregister.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('The model of the vehicle to unregister.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the vehicle to unregister.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const brand = interaction.options.getString('brand');
            const modelInput = interaction.options.getString('model');  
            const colorInput = interaction.options.getString('color');  


            const vehicle = await Vehicle.findOne({ userId, make: brand, model: modelInput, color: colorInput });

            if (!vehicle) {
                await interaction.reply({ content: 'No vehicle found with those details.', ephemeral: true });
                return;
            }


            const { year, make, model, color, numberPlate } = vehicle;

           
            await Vehicle.findOneAndDelete({ userId, make: brand, model: modelInput, color: colorInput });


            await interaction.reply({
                content: `Vehicle successfully unregistered.`,
                ephemeral: true
            });

        } catch (error) {
            console.error('An error occurred while executing the command:', error);
            await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    },
};
