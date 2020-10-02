const { Client } = require('../index.js');
const path = require('path');

// initialize the bot
const client = new Client({
	prefix: '!', // bot prefix
	ownerID: '465905397874688000', // discord user owner id
	inviteLink: 'https://www.google.com', // bot invite link
	commandsFolder: path.join(__dirname, 'commands') // commands folder
});

// to create a command category
client.addCommandsCategory('utility', 'utility commands');
// to create more than 1 command categories at once
client.addCommandsCategories([
	['moderation', 'moderation commands'],
	['music', 'music commands'],
]);

// get a commandCategory
client.commandsCategories.get('moderation');
// get a command
client.commandsCategories.get('moderation').get('ban');

// use the default help command
client.createDefaultHelp();

// start the bot with the token
client.start('NzIyODEzNTMyODk0MTM0MzMy.Xuoijw.bkPI0MoiE7iLunzpCZHLkzLBsP0');