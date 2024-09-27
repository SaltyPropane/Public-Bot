const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, dbconnect } = require('./config.json');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const executeQuery = (query) => {
	return new Promise((resolve, reject) => {
	  db.run(query, (error) => {
		if (error) {
		  reject(error);
		} else {
		  resolve();
		}
	  });
	});
  };

  //remove them from the db
  const removeUserFromDb = (userId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM guilds WHERE userId = ?', [userId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

  const createTables = async () => {
	try {
	  // Execute SQL queries to create tables
	  await executeQuery(`
		CREATE TABLE IF NOT EXISTS guilds (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  userId TEXT NOT NULL,
		  userIBAN TEXT,
		  turfsCapped INTEGER DEFAULT 0,
		  laundering INTEGER DEFAULT 0,
		  drugsSold INTEGER DEFAULT 0,
		  ouncesCut INTEGER DEFAULT 0,
		  cokeMade INTEGER DEFAULT 0,
		  methMade INTEGER DEFAULT 0,
		  armourMade INTEGER DEFAULT 0,
		  refiningBarrels INTEGER DEFAULT 0,
		  cocaPasteMade INTEGER DEFAULT 0,
		  atmsMade INTEGER DEFAULT 0,
		  rfMade INTEGER DEFAULT 0,
		  jewelryCrafted INTEGER DEFAULT 0,
		  gunpartsMade INTEGER DEFAULT 0,
		  sheetsMade INTEGER DEFAULT 0,
		  wireCrafted INTEGER DEFAULT 0,
		  fishCooked INTEGER DEFAULT 0,
		  premiumProcessed INTEGER DEFAULT 0,
		  regularProcessed INTEGER DEFAULT 0,
		  gangActivity INTEGER DEFAULT 0,

		  hempSupplies INTEGER DEFAULT 0,
		  metalSheetsSupplies INTEGER DEFAULT 0,
		  paydirtSupplies INTEGER DEFAULT 0,
		  premiumSupplies INTEGER DEFAULT 0,
		  thermalsSupplies INTEGER DEFAULT 0,
		  phoneSupplies INTEGER DEFAULT 0,
		  radioSupplies INTEGER DEFAULT 0,

		  lithPrecursors INTEGER DEFAULT 0,
		  phosPrecursors INTEGER DEFAULT 0,
		  barrelsPrecursors INTEGER DEFAULT 0,
		  procainePrecursors INTEGER DEFAULT 0,
		  procaineProcessed INTEGER DEFAULT 0,
		  cocaleafsPrecursors INTEGER DEFAULT 0,
		  refinedPrecursors INTEGER DEFAULT 0,

		  goldGems INTEGER DEFAULT 0,
		  opalGems INTEGER DEFAULT 0,
		  emeraldGems INTEGER DEFAULT 0,
		  rubyGems INTEGER DEFAULT 0,
		  diamondGems INTEGER DEFAULT 0,
		  blueDiamondGems INTEGER DEFAULT 0,
		  pinkDiamondGems INTEGER DEFAULT 0,
		  tanzaniteGems INTEGER DEFAULT 0,
		  larimarGems INTEGER DEFAULT 0,
		  topazGems INTEGER DEFAULT 0,
		  copperGems INTEGER DEFAULT 0,
		  copperWireGems INTEGER DEFAULT 0,
		  ironGems INTEGER DEFAULT 0,

		  screwsGun INTEGER DEFAULT 0,
		  pistolBodiesGun INTEGER DEFAULT 0,
		  gunBarrelsGun INTEGER DEFAULT 0,
		  gunStockGun INTEGER DEFAULT 0,
		  gunTriggerGun INTEGER DEFAULT 0,
		  springGun INTEGER DEFAULT 0,
		  heavyGunBarrelGun INTEGER DEFAULT 0,
		  smgBodyGun INTEGER DEFAULT 0,
		  rifleBodyGun INTEGER DEFAULT 0,

		  chardWine INTEGER DEFAULT 0,
		  pinotWine INTEGER DEFAULT 0,
		  zinfanWine INTEGER DEFAULT 0,
		  sauvignonWine INTEGER DEFAULT 0,
		  cabernetWine INTEGER DEFAULT 0,
		  fermentingWine INTEGER DEFAULT 0,

		  salmonFish INTEGER DEFAULT 0,
		  groupFish INTEGER DEFAULT 0,
		  dolphineFish INTEGER DEFAULT 0,

		  totalPayout INTEGER DEFAULT 0,
		  totalPoints INTEGER DEFAULT 0,

		  sojoGrown INTEGER DEFAULT 0,
		  khalifaKush INTEGER DEFAULT 0,
		  sourDiesel INTEGER DEFAULT 0,
		  whiteWidow INTEGER DEFAULT 0,
		  pineExpress INTEGER DEFAULT 0,



		activeKos INTEGER DEFAULT 0
		)
	  `);

	  console.log('Tables created successfully.');
	} catch (error) {
	  console.error('Error creating tables:', error);
	}
  };

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });



client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('guildMemberRemove', async member => {
    console.log(`Detected member leaving: ${member.user.id}`);
    try {
        const changes = await removeUserFromDb(member.user.id);
        if(changes > 0) {
            console.log(`Member ${member.user.id} has been removed from the table.`);
        } else {
            console.log(`No record found for member ${member.user.id} in the table.`);
        }
    } catch (error) {
        console.error(`Error removing member ${member.user.id} from the table: ${error}`);
    }
});


// Login and create database tables
client.login(token).then(() => {
	db.serialize(() => {
	  createTables();
	});
  }).catch(error => {
	console.error('Error logging in:', error);
  });