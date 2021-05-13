const { app, server } = require("../src/server");
const models = require("./models");
const supertest = require("supertest");
const mongoose = require("mongoose");

const paymentModel = models.payment;

beforeAll(async (done) => {
  console.log("beforeAll ... ");
  const d = require('./payments.test/payments_data.json');
  await paymentModel.insertMany(d);
  console.log('>>>> Insert the initial data...');
  done();
});

afterAll(async (done) => {
  console.log("afterAll ... ");
  const d = require('./payments.test/payments_data.json');
  for (const item of d) {
    await paymentModel.deleteMany(item);
  }
  console.log('>>>> Rollback the initial data...');
  await mongoose.connection.close();
  await server.close();
  done();
})

beforeEach((done) => {
  // console.log("beforeEach ... ");
  done();
});

afterEach((done) => {
  // console.log("afterEach ... ");
  done();
});


test("GET /payments", async (done) => {

  await supertest(app).get("/payments")
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      // console.log(`----------------> ${JSON.stringify(response.body)}`);
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(1);

      // Check property
      // console.log(`----------------> ${JSON.stringify(response.body[0])}`);
      expect(response.body[0]).toHaveProperty('userName');
      expect(response.body[0]).toHaveProperty('orderId');
      expect(response.body[0]).toHaveProperty('productName');
      expect(response.body[0]).toHaveProperty('quality');
      expect(response.body[0]).toHaveProperty('price');
      done();
    });
});

test("GET /payments?productName=eq:testingtesting_product2", async (done) => {

  await supertest(app).get("/payments?productName=eq:testingtesting_product2")
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      // console.log(`----------------> ${JSON.stringify(response.body)}`);
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);

      // Check property
      // console.log(`----------------> ${JSON.stringify(response.body[0])}`);
      expect(response.body[0]).toHaveProperty('userName');
      expect(response.body[0]).toHaveProperty('orderId');
      expect(response.body[0]).toHaveProperty('productName');
      expect(response.body[0]).toHaveProperty('quality');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0].productName).toBe("testingtesting_product2");
      done();
    });
});

test("POST /checkout", async (done) => {

  const data = [{"userName": "newnewnewPaymentPaymentPayment", "orderId": 1, "productName": "newnewnew_product", "quality": 1, "price": 200}];

  beforeEach(async (done) => {
    done()
  });
  
  await supertest(app).post("/checkout")
    .send(data)
    .expect(200)
    .then(async () => {

      // Check data in the database      
      const p = await paymentModel.findOne({ userName: data[0].userName });
      expect(p).toBeTruthy();
      expect(p.userName).toBe(data[0].userName);
      expect(p.orderId).toBe(data[0].orderId);
      expect(p.productName).toBe(data[0].productName);
      expect(p.quality).toBe(data[0].quality);
      expect(p.price).toBe(data[0].price);

      
      done();
    });

  afterEach(async (done) => {
    // delete inserted product
    await paymentModel.deleteOne({ userName: data[0].userName });
    done();
  });
});

test("DELETE /payments", async (done) => {
  const data = {"userName": "deletedeletedelete_PaymentPaymentPayment", "orderId": 1, "productName": "deletedeletedelete_product", "quality": 1, "price": 200};

  beforeEach(async (done) => {
    await paymentModel.create(data);
    done()
  });

  await supertest(app)
    .delete("/payments")
    .send([data])
    .expect(200)
    .then(async (res) => {
      const p = await paymentModel.findOne(data);
      expect(p).toBeFalsy();
      done();
    });
});
