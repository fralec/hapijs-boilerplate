'use strict';

exports.get = {
    description: 'Get Default Path',
    notes: 'Return the name and the version of the API with the plain text format',
    tags: ['api'],
    auth: false,
    handler: function(request, reply) {
        reply('Hi! ')
        .code(200);
    }
};
