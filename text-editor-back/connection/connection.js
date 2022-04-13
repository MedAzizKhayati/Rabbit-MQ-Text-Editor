var amqp = require('amqplib/callback_api')
const rabbitMQHandler = (callback) => {
    amqp.connect('amqp://localhost',
        (error, conection) => {
            if (error) 
                throw new Error(error);
            callback(conection);
        })
};

const channelHandler = (callback) => {
    rabbitMQHandler((connection) => {
        connection.createChannel((err, channel) => {
            if (err) {
                throw new Error(err);
            }
            callback(channel);
        })
    })
}

module.exports = {
    rabbitMQHandler,
    channelHandler
}
