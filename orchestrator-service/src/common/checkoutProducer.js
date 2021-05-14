const amqplib = require('amqplib');

const qName = 'payment';
const url = 'amqp://localhost';

class CheckoutProducer {
  constructor() {
    this.ch = null;
  }

  async connect() {
    try {
      const conn = await amqplib.connect(url);
      this.ch = await conn.createChannel();
      return await this.ch.assertQueue(qName);
    } catch (e) {
      throw e;
    }
  }

  send(message) {
    const msg = JSON.stringify(message);
    return this.ch.sendToQueue(qName, Buffer.from(msg, 'utf8'));
  }
}

module.exports = CheckoutProducer;
