module.exports = {
	name: 'info',
	description: 'bot infos',
	
	run: (client, message) => {
		console.log('bot infos');
		console.log('prefix: ' + client.prefix);
		console.log('owner: ' + client.ownerID);
		console.log('inviteLink: ' + client.inviteLink);
	}
}