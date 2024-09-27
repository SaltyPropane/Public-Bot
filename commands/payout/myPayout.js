const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mypayout')
    .setDescription('Show your total payout based on guild contributions.'),

  async execute(interaction) {
    const db = new sqlite3.Database('database.db', sqlite3.OPEN_READONLY, err => {
      if (err) {
        console.error('Error opening database:', err);
        return interaction.reply('An error occurred while accessing the database.');
      }
    });

    db.all('SELECT * FROM guilds', (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err);
        db.close();
        return interaction.reply('An error occurred while retrieving data.');
      }

      const totalGuildPoints = rows.reduce((acc, row) => acc + calculateTotalPoints(row), 0);
      const userRow = rows.find(row => row.userId === interaction.user.id);

      if (!userRow) {
        db.close();
        return interaction.reply('No data found for your user.');
      }

      const userPoints = calculateTotalPoints(userRow);
      const userPercentage = totalGuildPoints > 0 ? ((userPoints / totalGuildPoints) * 100) : 0;
      const totalPayout = Math.floor((userPercentage / 100) * 10_000_000).toLocaleString(); // CHANGE VALUE HERE FOR MY PAYOUT TO DISPLAY CORRECT AMOUNT
      const totalPayoutFormatted = totalPayout.toLocaleString(); 

      const embed = new EmbedBuilder()
        .setColor([52, 119, 235])
        .setTitle('Your Total Payout')
        .setAuthor({ name: '', iconURL: '' })
        .addFields(
          { name: 'Your Contribution Points:', value: `${userPoints.toLocaleString()}` },
          { name: 'Your Contribution Percentage:', value: `${userPercentage.toFixed(2)}%` },
          { name: 'Payout:', value: `$${totalPayoutFormatted}` },
          { name: 'IBAN:', value: `${userRow.userIBAN ?? 'Not Set'}` }
        );

      db.close();
      return interaction.reply({ embeds: [embed] });
    });
  }
};

function calculateTotalPoints(row) {
  return (
    (row.laundering ?? 0) * 0 +
    (row.procaineProcessed ?? 0) * 0 +
    (row.turfsCapped ?? 0) * 0 +
    (row.drugsSold ?? 0) * 0 +
    (row.ouncesCut ?? 0) * 0 +
    (row.cokeMade ?? 0) * 0 +
    (row.methMade ?? 0) * 0 +
    (row.armourMade ?? 0) * 0 +
    (row.refiningBarrels ?? 0) * 0 +
    (row.cocaPasteMade ?? 0) * 0 +
    (row.atmsMade ?? 0) * 0 +
    (row.rfMade ?? 0) * 0 +
    (row.jewelryCrafted ?? 0) * 0 +
    (row.gunpartsMade ?? 0) * 0 +
    (row.sheetsMade ?? 0) * 0 +
    (row.wireCrafted ?? 0) * 0 +
    (row.fishCooked ?? 0) * 0 +
    (row.premiumProcessed ?? 0) * 0 +
    (row.regularProcessed ?? 0) * 0 +
    (row.hempSupplies ?? 0) * 0 +
    (row.metalSheetsSupplies ?? 0) * 0 +
    (row.paydirtSupplies ?? 0) * 0 +
    (row.premiumSupplies ?? 0) * 0 +
    (row.thermalsSupplies ?? 0) * 0 +
    (row.phoneSupplies ?? 0) * 0 +
    (row.radioSupplies ?? 0) * 0 +
    (row.lithPrecursors ?? 0) * 0 +
    (row.phosPrecursors ?? 0) * 0 +
    (row.barrelsPrecursors ?? 0) * 0 +
    (row.procainePrecursors ?? 0) * 0 +
    (row.cocaleafsPrecursors ?? 0) * 0 +
    (row.refinedPrecursors ?? 0) * 0 +
    (row.goldGems ?? 0) * 0 +
    (row.opalGems ?? 0) * 0 +
    (row.emeraldGems ?? 0) * 0 +
    (row.rubyGems ?? 0) * 0 +
    (row.diamondGems ?? 0) * 0 +
    (row.blueDiamondGems ?? 0) * 0 +
    (row.pinkDiamondGems ?? 0) * 0 +
    (row.tanzaniteGems ?? 0) * 0 +
    (row.larimarGems ?? 0) * 0 +
    (row.topazGems ?? 0) * 0 +
    (row.copperGems ?? 0) * 0 +
    (row.copperWireGems ?? 0) * 0 +
    (row.ironGems ?? 0) * 0 +
    (row.screwsGun ?? 0) * 0 +
    (row.pistolBodiesGun ?? 0) * 0 +
    (row.gunBarrelsGun ?? 0) * 0 +
    (row.gunStockGun ?? 0) * 0 +
    (row.gunTriggerGun ?? 0) * 0 +
    (row.springGun ?? 0) * 0 +
    (row.heavyGunBarrelGun ?? 0) * 0 +
    (row.smgBodyGun ?? 0) * 0 +
    (row.rifleBodyGun ?? 0) * 0 +
    (row.chardWine ?? 0) * 0 +
    (row.pinotWine ?? 0) * 0 +
    (row.zinfanWine ?? 0) * 0 +
    (row.sauvignonWine ?? 0) * 0 +
    (row.cabernetWine ?? 0) * 0 +
    (row.fermentingWine ?? 0) * 0 +
    (row.salmonFish ?? 0) * 0 +
    (row.groupFish ?? 0) * 0 +
    (row.dolphinFish ?? 0) * 0 +
    (row.activeKos ?? 0) * 0 +
    (row.gangActivity ?? 0) * 0 +
    (row.sojoGrown ?? 0) * 0 +
    (row.mackerelFish ?? 0) * 0 +
    (row.bassFish ?? 0) * 0 +
    (row.pikeFish ?? 0) * 0 +
    (row.tunaFish ?? 0) * 0 +
    (row.stingrayfish ?? 0) * 0 +
    (row.stingrayTailFish ?? 0) * 0 +
    (row.khalifaKush ?? 0) * 0 +
    (row.sourDiesel ?? 0) * 0 +
    (row.whiteWidow ?? 0) * 0 +
    (row.pineExpress ?? 0) * 0 +
    (row.barteringMission ?? 0) * 0
  );
}
