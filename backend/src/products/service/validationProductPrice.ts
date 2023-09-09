import { PackDto, ProductDto, productsRepository } from '../repositories/Products';

const PERCENTAGE = 10;

export interface IProduct {
  code: number;
  price: number
}

class ValidationPriceService {
	calculatePriceAdjustment(value: number) {
		const totalPositive = value + (value * (PERCENTAGE / 100));
		const totalNegative = value - (value * (PERCENTAGE / 100));

		return {
			totalPositive,
			totalNegative
		};
	}

	emptyAndNaNFields(item: IProduct) {
		const messageList: string[] = [];
		const product = { ...item };
		if (!product.code) {
			messageList.push('Código não informado');
		}

		if (!product.price) {
			messageList.push('Preço não informado');
		}

		if (isNaN(product.price)) {
			messageList.push('O preço informado não é um valor numérico válido');
		}

		return messageList;
	}

	priceFieldRules(productApi: IProduct, productBaseData: ProductDto) {
		const messageList: string[] = [];
		const price = Number(productApi.price);

		if (price < productBaseData?.cost_price) {
			messageList.push('O preço de venda está abaixo do preço de custo.');
		}

		const { totalNegative, totalPositive } = this.calculatePriceAdjustment(productBaseData.sales_price);

		if (price < totalNegative) {
			messageList.push(`O reajuste está abaixo dos ${PERCENTAGE}% estipulados`);
		}

		if (price > totalPositive) {
			messageList.push(`O reajuste está acima dos ${PERCENTAGE}% estipulados`);
		}

		return messageList;

	}

	packUpdateRules(newPrice: number, productsList: IProduct[], pack?: PackDto) {
		if (!pack) return [];
		const messageList: string[] = [];
		const productItem = productsList.find((item) => Number(item.code) === pack.product_id);

		if (!productItem) {
			messageList.push('O produto é um pack e não foi encontrada a atualização de preço do produto unitário');
			return messageList;
		}

		const checkPricePackBasedProductItem = productItem.price * pack.qty;

		if (checkPricePackBasedProductItem !== Number(newPrice)) {
			messageList.push(`Valor do produto unitário (código ${productItem.code}) contido no pack está incorreto.`);
		}

		return messageList;
	}

	async validation(item: IProduct, listProducts: IProduct[]) {
		const messages: string[] = [];

		const empty = this.emptyAndNaNFields(item);

		messages.push(...empty);

		if (empty.length > 0) {
			return {
				code: item?.code,
				new_price: item.price,
				isValid: messages.length === 0 ? true : false,
				message: messages
			};
		}

		const [product, pack] = await Promise.all([productsRepository.getProductByCode(item.code), productsRepository.getProductPackByCode(item.code)]);

		if (!product) {
			messages.push('O produto não existe na base de dados.');
			return {
				code: item?.code,
				new_price: item.price,
				isValid: messages.length === 0 ? true : false,
				message: messages
			};
		}

		const prices = this.priceFieldRules(item, product);
		const packData = this.packUpdateRules(item.price, listProducts, pack);

		messages.push(...prices, ...packData);

		return {
			code: item?.code,
			name: product?.name,
			current_price: product?.sales_price,
			new_price: item.price,
			isValid: messages.length === 0 ? true : false,
			message: messages
		};
	}

}

export const validationPriceService = new ValidationPriceService();
