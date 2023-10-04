const jwt = require('jsonwebtoken');
const {sendError} = require('../responses/index');

const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '');
            const requestedUser = request.event.body.userName;
            console.log(requestedUser);
            
            if (!token) return sendError(401, 'Token not provided');

            const data = jwt.verify(token, 'a1b1c1');
            console.log(data.userName);
            if (!data.userName) return sendError(401, 'Invalid token');
            if (requestedUser !== data.userName) return sendError(401, 'Requested username does not match logged in user' )
            request.event.userName = data.userName;
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(401, 'Invalid token')
        }
    },
    onError: async (request) => {
        request.event.error = '401';
        return request.response;
    }
};

module.exports = {validateToken}