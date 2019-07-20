export default class Product {
	constructor(db) {
		this.db = db;
		this.collectionName = 'products';
		this.collection = db.collection(this.collectionName);
	}

	findById(productId) {
		return this.collection.findOne({ _id: productId });
	}

	findByIds(ids) {
		return this.collection.find({ _id: { $in: ids } }).toArray();
	}

	findByBrand(brandName, sort = {}) {
		return this.collection
			.find({ brand: brandName })
			.sort(sort)
			.toArray();
	}

	async serialize(productId) {
		const product = await this.findById(productId);
		const relatedIds = product.relatedProducts.map(({ _id }) => _id);
		const relatedProducts = await this.findByIds(relatedIds);

		return {
			id: product._id.toString(),
			model: product.modelNum,
			sku: `${product.brand}-${product.modelNum}`,
			title: product.name,
			brandName: product.brand,
			price: product.salePrice,
			listPrice: product.msrp,
			discount:
				product.salePrice > product.msrp
					? product.salePrice - product.msrp
					: null,
			relatedProducts: relatedProducts.map(relatedProduct => ({
				id: relatedProduct._id.toString(),
				title: relatedProduct.name,
				brandName: relatedIds.brand
			}))
		};
	}
}
