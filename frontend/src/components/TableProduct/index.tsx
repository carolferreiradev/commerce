interface IProduct {
  code: string;
  name: string;
  current_price: string;
  new_price: string;
  isValid: boolean;
  message: string[];
}

interface Props{
  products: IProduct[]
}

export function TableProduct(props:Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Preço Atual</th>
          <th>Novo Preço</th>
          <th>Erros</th>
        </tr>
      </thead>
      <tbody>
        {props.products?.map((product) => (
          <tr key={product.code}>
            <td>{product.code || '---'}</td>
            <td>{product.name || '---'}</td>
            <td>{product.current_price || '---'}</td>
            <td>{product.new_price || '---'}</td>
            <td>{product.message.join(`; `) || '---'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}