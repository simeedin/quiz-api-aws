const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {comparePassword} = require('../../utils');

async function userLogin(body) {
    const {userName, password} = body

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `ACCOUNT#${userName}`
        }
    }).promise()

    if (!Item) return sendError(404, 'User not found')

    const correctPwd = await comparePassword(password, Item.password);

    if (!correctPwd) return sendError(400, 'Invalid password');

    const token = jwt.sign({userName: Item.userName}, 'a1b1c1', {
        expiresIn: 1800
    })

    return sendResponse(200, {success: true, token: token})
}

const handler = middy()
    .use(jsonBodyParser())
    .handler(async (event) => {
        console.log(event);
        try {
            return await userLogin(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}