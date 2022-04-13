let amqp = require('amqplib/callback_api');
let amqpConn = null;

const start = () => {
    amqp.connect("amqp://localhost", (err, conn) => {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;
        whenConnected();
    });
}
start();

function whenConnected() {
    startPublisher();
    //startWorker();
    startReceiver();
}

function startPublisher() {
    amqpConn.createConfirmChannel(function (err, ch) {
        if (err) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        let q = "JSQueue";
        let msg = "Hello JS 2";
        ch.assertQueue(q, { durable: false });
        ch.sendToQueue(q, Buffer.from(msg));
    });
}

function startReceiver() {
    amqpConn.createConfirmChannel(function (err, ch) {
        if (err) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        let q = "JSQueue";
        ch.assertQueue(q, { durable: false });
        ch.consume(q, msg => {
            console.log("Received: ", msg.content.toString());
        }, { noAck: false });
    });
}

