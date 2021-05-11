const amqplib = require('amqplib');

const qName = 'checkout';

class Checkout {

  constructor() {
    this.ch = null;
  }

  async connect() {
    
    const conn = await amqplib.connect('amqp://localhost');
    this.ch = await conn.createChannel();
    await this.ch.assertQueue(qName);
  }

  send(message) {
    const qm = JSON.stringify(message);
    return this.ch.sendToQueue(qName, Buffer.from(qm, 'utf8'));
  }
}