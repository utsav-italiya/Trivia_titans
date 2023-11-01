const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

class User {
    constructor({ id, totalGamePlayed, win, loss, totalPoints, achievements }) {
        this.id = id;
        this.totalGamePlayed = totalGamePlayed;
        this.win = win;
        this.loss = loss;
        this.totalPoints = totalPoints;
        this.achievements = achievements;
    }

    save(callback) {
        const params = {
            TableName: "userprofile",
            Item: {
                id: this.id,
                totalGamePlayed: this.totalGamePlayed,
                win: this.win,
                loss: this.loss,
                totalPoints: this.totalPoints,
                achievements: this.achievements,
            },
        };

        dynamodb.put(params, (err) => {
            if (err) {
                callback(err);
            } else {
                console.log("hello world")
                callback(null);
            }
        });
    }

    static getProfileByUserId(userId, callback) {
        const params = {
            TableName: 'userprofile',
            Key: {
                id: userId,
            },
        };

        dynamodb.get(params, (err, data) => {
            if (err) {
                callback(err);
            } else {
                const profileData = data.Item || {};
                callback(null, profileData);
            }
        });
    }

    static updateProfileByUserId(userId, updatedData, callback) {
        const params = {
            TableName: 'userprofile',
            Key: {
                id: userId,
            },
            UpdateExpression: 'SET #tg = #tg + :totalGamePlayed, #w = #w + :win, #l = #l + :loss, #tp = #tp + :totalPoints',
            ExpressionAttributeNames: {
                '#tg': 'totalGamePlayed',
                '#w': 'win',
                '#l': 'loss',
                '#tp': 'totalPoints',
            },
            ExpressionAttributeValues: {
                ':totalGamePlayed': updatedData.totalGamePlayed || 0,
                ':win': updatedData.win || 0,
                ':loss': updatedData.loss || 0,
                ':totalPoints': updatedData.totalPoints || 0,
            },
            ReturnValues: 'ALL_NEW',
        };

        dynamodb.update(params, (err, data) => {
            if (err) {
                callback(err);
            } else {
                const updatedProfile = data.Attributes || {};
                callback(null, updatedProfile);
            }
        });
    }
}

module.exports = User;