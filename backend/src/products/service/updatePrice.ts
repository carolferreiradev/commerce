import { productsRepository } from '../repositories/Products';
import { IProduct, validationPriceService } from './validationProductPrice';

class UpdatePrice {
	async productPriceSingle(code: number, newPrice: number) {
		await productsRepository.updatePriceProduct(code, newPrice);
	}

	async productPriceMany(products: IProduct[]) {
		const productsInvalid = (await Promise.all(products.map(async (item) => {
			const product = await validationPriceService.validation(item, products);
			if (!product.isValid) {
				return product;
			}
		}))).filter(Boolean);

		if(productsInvalid.length > 0){
			return {
				productsInvalid
			};
		}

		await Promise.all(products.map(async (item) => {
			await this.productPriceSingle(item.code, Number(item.price));
		}));
	}
}

export const updatePrice = new UpdatePrice();
