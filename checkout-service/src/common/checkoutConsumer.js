const amqplib = require('amqplib');
const config = require('../config')[process.env.NODE_ENV || 'development'];
const models = require('../models');

const paymentModel = models.payment;
const log = config.log();
const q = 'payment';
const url = 'amqp://localhost'

class CheckoutConsumer {

  async connect() {
    this.msg = null;
    const conn = await amqplib.connect(url);
    this.ch = await conn.createChannel();
    return this.ch;
  }

  async start() {
    await this.connect();
    log.info("The Message MQ has been connected...");
    return this.ch.assertQueue(q).then(() => this.ch.consume(q, async (msg) => {
      let result = null;
      this.msg = msg;
      if (this.msg && this.msg.content) {
        log.info(`Got message from Message MQ ${msg.content.toString()}...`);
        const aData = JSON.parse(msg.content.toString());
        /* eslint-disable no-await-in-loop */
        const filteredData = [];
        for (const item of aData) {
          const exists = await paymentModel.exists({
            userName: item.userName,
            orderId: item.orderId
          });
          log.debug(`${JSON.stringify(item)} -> ${exists}`)
          if (!exists) {
            filteredData.push(item);
          }
        }
        /* eslint-disable no-await-in-loop */
        result = await paymentModel.insertMany(filteredData);
        log.info(`Data has been inserted into DB -> ${JSON.stringify(filteredData)}...`)
      }
      return result;

    })).catch(err => log.fatal(err));
  }
}

class Singleton {

  constructor() {
      if (!this.instance) {
        this.instance = new CheckoutConsumer();
      }
  }

  getInstance() {
      return this.instance;
  }

}
module.exports = Singleton;