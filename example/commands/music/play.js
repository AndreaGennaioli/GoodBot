module.exports = {
	name: 'play',
	description: 'play a song',
	argsType: 'single',

	run: (client, message, args) => {
		console.log('play ' + args);
	}
}