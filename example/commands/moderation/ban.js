module.exports = {
	name: 'ban',
	description: 'ban an user',

	run: (client, message) => {
		console.log('ban ' + message.mentions.users.first());
	}
}