import { Request, Response } from 'express';
import { readAndReturnContentFile } from '../../utils/readAndReturnContentFile';
import { IProduct, validationPriceService } from '../service/validationProductPrice';
import { updatePrice } from '../service/updatePrice';
import { productsRepository } from '../repositories/Products';

export interface IValidationResponse {
  code: number
  name: string
  current_price: number
  new_price: number
  isValid: boolean
  message: string[]
}

class ProductsController {

	async listProducts(req: Request, res: Response) {
		const response = await productsRepository.getListProduct();
		res.send(response);
	}

	async validationFileUploadPrice(req: Request, res: Response) {
		const buffer = req?.file?.buffer;

		if (!buffer) {
			res.status(400).send({
				message: 'Arquivo não encontrado.'
			});
			return;
		}
		const HEADER = ['code', 'price'];
		const file = readAndReturnContentFile<IProduct>(buffer, HEADER);

		const fileValidation = await Promise.all(file.map(async (item: IProduct) => {
			return await validationPriceService.validation(item, file);
		}));

		res.send(fileValidation);
	}

	async pricesUpdateMany(req: Request, res: Response) {

		try {
			const products: IValidationResponse[] = req.body.products;

			if (!products || products.length === 0) {
				res.status(400).send({
					message: 'Produtos não encontrados.'
				});
				return;
			}

			const listProducts: IProduct[] = products.map((item) => {
				return {
					...item,
					price: item.new_price
				};
			});

			const response = await updatePrice.productPriceMany(listProducts);

			if(response?.productsInvalid){
				return res.status(400).send(response.productsInvalid);
			}

			res.status(200).send({
				message: 'Produtos alterados com sucesso'
			});
		} catch (error) {
			res.status(400).send({
				message: error
			});
			return;
		}
	}
}

export const productsController = new ProductsController();
