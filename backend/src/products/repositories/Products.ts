import { connection } from '../../database/connection';

export interface ProductDto {
  code: number,
  name: string,
  cost_price: number,
  sales_price: number
}

export interface PackDto {
  id: number,
  pack_id: number,
  product_id: number,
  qty: number
}

class ProductsRepository {

	async getListProduct() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [data]: any[] = await connection.execute(`
        SELECT * FROM commerce.products
    `);

		return data;
	}

	async updatePriceProduct(code: number, newPrice: number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [data]: any[] = await connection.execute(`
      UPDATE commerce.products
      SET sales_price='${newPrice}'
      WHERE commerce.products.code=${code}
    `);

		return data[0];
	}

	async getProductByCode(code: number): Promise<ProductDto | undefined> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [data]: any[] = await connection.execute(`
      SELECT * FROM commerce.products
      WHERE code=${code}
    `);

		return data[0];
	}

	async getProductPackByCode(code: number): Promise<PackDto | undefined> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [packs]: any[] = await connection.execute(
			`SELECT * FROM commerce.packs
       WHERE pack_id=${code}
    `);

		return packs[0];
	}
}

export const productsRepository = new ProductsRepository();
