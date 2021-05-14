const { app, server } = require("../src/server");
const models = require("./models");
const supertest = require("supertest");
const mongoose = require("mongoose");

const productModel = models.product;

beforeAll(async (done) => {
  console.log("beforeAll ... ");
  console.log('>>>> Delete all data in product...');
  await productModel.deleteMany();
  const d = require('./products.test/product_data.json');
  await productModel.insertMany(d);
  console.log('>>>> Insert the initial product data...');
  done();
});

afterAll(async (done) => {
  console.log("afterAll ... ");
  const d = require('./products.test/product_data.json');
  for (let item of d) {
    await productModel.deleteMany(item);
  }
  console.log('>>>> Rollback the initial product data...');
  await mongoose.connection.close();
  // await app.close();
  server.close(() => {
    console.log('Http server closed.');
    done();
  });
})

beforeEach((done) => {
  // console.log("beforeEach ... ");
  done();
});

afterEach((done) => {
  // console.log("afterEach ... ");
  done();
});


test("GET /products", async (done) => {

  await supertest(app).get("/products")
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(1);

      // Check property
      // console.log(`----------------> ${JSON.stringify(response.body[0])}`);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('branch');
      expect(response.body[0]).toHaveProperty('color');
      done();
    });
});

test("GET /products?name=eq:testing_product_test2", async (done) => {

  await supertest(app).get("/products?name=eq:testing_product_test2")
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
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('branch');
      expect(response.body[0]).toHaveProperty('color');
      expect(response.body[0].name).toBe("testing_product_test2");
      done();
    });
});

test("POST /products", async (done) => {

  const data = [{ "name": "newnewnewProductProductProduct", "price": 1, "branch": "Branch 3", "color": "Color 3" }];

  await supertest(app).post("/products")
    .send(data)
    .expect(200)
    .then(async () => {

      // Check data in the database      
      const product = await productModel.findOne({ name: data[0].name });
      expect(product).toBeTruthy();
      expect(product.name).toBe(data[0].name);
      expect(product.price).toBe(data[0].price);
      expect(product.branch).toBe(data[0].branch);
      expect(product.color).toBe(data[0].color);
      done();
    });

    afterEach(async (done) => {
      // delete inserted product
      await productModel.deleteOne({ name: data[0].name });
      done();
    });
});

test("DELETE /products", async (done) => {
  const data = { "name": "deletedeleteProductProductProduct", "price": 1, "branch": "Branch 3", "color": "Color 3" }

  beforeEach(async (done) => {
    await productModel.create(data);
    done()
  });

  await supertest(app)
    .delete("/products")
    .send([data])
    .expect(200)
    .then(async (res) => {
      const p = await productModel.findOne(data);
      expect(p).toBeFalsy();
      done();
    });
});
