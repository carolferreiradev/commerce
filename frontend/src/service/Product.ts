import { API_URL } from "../api"

interface IProduct {
  code: string;
  name: string;
  current_price: string;
  new_price: string;
  isValid: boolean;
  message: string[];
}

interface IUpdateMany{
  products: IProduct[]
}

export async function updateManyProducts(request: IUpdateMany){
  const data = await fetch(`${API_URL}/products/prices/update-many`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })
  return await data.json()
}

export async function fileUploadValidation(formData: FormData){
  const request = await fetch(`${API_URL}/products/file/upload-validation`, {
    method: 'POST',
    body: formData
  })
  return await request.json()
}