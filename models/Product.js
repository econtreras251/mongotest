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
		const relatedProducts = await this.findByIds(
			product.relatedProducts
		);

		return {
			id: product._id.toString(),
			model: product.modelNum,
			sku: `${product.brand}-${product.modelNum}`,
			title: product.name,
			brandName: product.brand,
			price: product.salePrice,
			listPrice: product.msrp,
			discount:
				product.salePrice < product.msrp
					? product.msrp - product.salePrice
					: 0,
			discountPercent:
				product.salePrice < product.msrp
					? Math.floor(
							((product.msrp - product.salePrice) /
								product.salePrice) *
								100
					  )
					: 0,
			relatedProducts: relatedProducts.map(relatedProduct => ({
				id: relatedProduct._id.toString(),
				title: relatedProduct.name,
				brandName: relatedProduct.brand
			}))
		};
	}
}
