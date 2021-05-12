const amqplib = require('amqplib');
const config = require('../config')[process.env.NODE_ENV || 'development'];
const models = require('../models');

const paymentModel = models.payment;
const log = config.log();
const q = 'payment';
const url = 'amqp://localhost'

class CheckoutConsumer {

  async start() {
    amqplib.connect(url).then(conn => conn.createChannel())
      .then(ch => ch.assertQueue(q).then(() => ch.consume(q, async (msg) => {

        if (msg && msg.content) {
          log.debug(`Got message from Message MQ ${msg.content.toString()}...`);
          const aData = JSON.parse(msg.content.toString());

          const filteredData = [];
          for(let item of aData) {
            const exists = await paymentModel.exists({
              userName: item.userName,
              orderId: item.orderId
            });
            log.debug(`${JSON.stringify(item)} -> ${exists}`)
            if (!exists) {
              filteredData.push(item);
            }
          }

          const result = await paymentModel.insertMany(filteredData);
          log.debug(`Data has been inserted into DB -> ${JSON.stringify(filteredData)}...`)
          return result;
        }

      }))).catch(err => log.fatal(err));
  }
}
module.exports = CheckoutConsumer;