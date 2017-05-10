let index = require('./handlers/index.js');

module.exports = [

	//Default Page Manager
	{path: '/', method: 'GET', config: index.get },
]
