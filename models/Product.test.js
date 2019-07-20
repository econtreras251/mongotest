import TestDbHelper from '../testUtils/testDbHelper';
import Product from './Product';

const dbHelper = new TestDbHelper();

beforeAll(async () => {
	await dbHelper.start();
});

afterAll(async () => {
	await dbHelper.stop();
});

let product;
beforeEach(async () => {
	product = new Product(dbHelper.db);
});

afterEach(async () => {
	await dbHelper.cleanup();
});

// TODO: replace with fake.js
async function createSampleProducts() {
	const product1 = await dbHelper.createDoc(product.collectionName, {
		name: 'PLUS Sewing Quilting Machine',
		modelNum: 'B880',
		brand: 'Bernina',
		salePrice: 349.99,
		msrp: 329.99,
		relatedProducts: []
	});
	const product2 = await dbHelper.createDoc(product.collectionName, {
		name: 'Mechanical Sewing Machine with Foot Pedal',
		modelNum: '10',
		brand: 'Alphasew',
		salePrice: 79.99,
		relatedProducts: []
	});
	const product3 = await dbHelper.createDoc(product.collectionName, {
		name: 'L460 Overlocker',
		modelNum: 'L460',
		brand: 'Bernina',
		salePrice: 189.99,
		relatedProducts: []
	});
	const product4 = await dbHelper.createDoc(product.collectionName, {
		name: 'Sewing & Embroidery Machine',
		modelNum: 'NQ3600D',
		brand: 'Brother',
		salePrice: 219.99,
		msrp: 249.99,
		relatedProducts: [product1._id, product3._id]
	});

	return { product1, product2, product3, product4 };
}

describe('findById', () => {
	test('should return the correct document by ID', async () => {
		const { product2 } = await createSampleProducts();
		const result = await product.findById(product2._id);

		expect(result).toMatchObject(product2);
	});

	test('should return null if a document with the provided ID could not be found', async () => {
		const result = await product.findById('123456789123');
		expect(result).toBeNull();
	});
});

describe('findByIds', () => {
	test('should return the correct documents by ID', async () => {
		const { product1, product3 } = await createSampleProducts();
		const result = await product.findByIds([
			product1._id,
			product3._id
		]);
		expect(result).toMatchObject([product1, product3]);
	});

	test('should return empty array if documents with the provided IDs could not be found', async () => {
		const result = await product.findByIds(['123456789123']);
		expect(result).toEqual([]);
	});
});
