const {channelHandler} = require('./connection');

module.exports.sendMessageToQueue = (message, queue) => {
    channelHandler((channel) => {
        channel.assertQueue(queue, {
            durable: false
        })
        channel.sendToQueue(queue, Buffer.from(message));
        console.log("[x] Sent %s", message, " to ", queue);
    })
}

module.exports.listenToQueue = (queue, callback, requeue = false) => {
    channelHandler((channel) => {
        channel.assertQueue(queue, {
            durable: false
        })
        channel.consume(queue, (msg) => {
            callback(msg.content.toString(), channel);
            requeue ? channel.nack(msg) : channel.ack(msg);
        }, { noAck: false });
    })
}

module.exports.readFromQueue = (queue, callback, requeue = false) => {
    channelHandler(channel => {
        channel.assertQueue(queue, {
            durable: false
        })
        channel.get(queue, { noAck: false }, (err, msg) => {
            if(err)
                throw new Error(err);
            if (msg)
                requeue ? channel.nack(msg) : channel.ack(msg);
            callback(msg?.content?.toString(), channel);
        })
    })
}

module.exports.listenOnExchange = (exchange, callback) => {
    channelHandler(channel => {
        channel.assertExchange(exchange, "fanout", {
            durable: false
        });
        channel.assertQueue('', { exclusive: true }, (err, q) => {
            if(err)
                throw new Error(err);
            channel.bindQueue(q.queue, exchange, '');
            channel.consume(q.queue, msg => {
                callback(msg.content.toString(), channel);
            }, { noAck: true });
        });
    });
}
