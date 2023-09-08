/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useState } from "react";
import { Header } from "../../components/Header";
import styles from './styles.module.css'
import { Loader } from "../../components/Loader";
import { toast } from "react-toastify";
import { fileUploadValidation, updateManyProducts } from "../../service/Product";
import { TableProduct } from "../../components/TableProduct";

interface IProduct {
  code: string;
  name: string;
  current_price: string;
  new_price: string;
  isValid: boolean;
  message: string[];
}

export function PriceUpdate() {
  const [fileRead, setFileRead] = useState<File | null>(null)
  const [productsValidate, setProductsValidate] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [warningToUser, setWarningToUser] = useState<string | null>(null)


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        const { isValid, message } = validationContentCSV(content);

        setWarningToUser(message)

        if (!isValid) return

        setFileRead(file)
      };
      reader.readAsText(file);
    }
  };

  const validationContentCSV = (content: string) => {
    const lines = content
      .split('\n')
      .map((item: string) => item.replace(/\r/g, ''))
      .filter(Boolean);

    lines.shift()

    const listNaN: any[] = []

    lines.forEach((line: any) => {
      const rowCurrent = line.split(',').filter(Boolean)

      rowCurrent.forEach((row: any) => {
        if (isNaN(Number(row))) {
          listNaN.push(row)
        }
      });

    });

    if (listNaN.length > 0) {
      return {
        isValid: false,
        message: `Os seguintes campos são inválidos por não serem números: ${listNaN}`,
      }
    }

    return {
      isValid: true,
      message: `Arquivo pronto para ser validado`,
    }

  };

  const handleValidData = async (event: FormEvent) => {
    event.preventDefault()
    if (!fileRead) return
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('updatePrice', fileRead)

      const response: IProduct[] = await fileUploadValidation(formData)
      const hasSomeInvalid = response.find((item) => !item.isValid)

      if (!hasSomeInvalid) {
        setIsValid(true)
      }
      setProductsValidate(response)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePrices = async () => {
    try {
      setIsLoading(true)

      const request = {
        products: productsValidate,
      }
      const { message } = await updateManyProducts(request)

      toast.success(message)
      clearStates()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const clearStates = () => {
    setFileRead(null)
    setProductsValidate([])
    setWarningToUser(null)
  }

  return (
    <>
      {isLoading && <Loader />}
      <Header title="Atualização de Preços" />
      <div className={styles.container}>
        <div className={styles.page__content}>
          {!fileRead && (
            <div className={styles.page__content__file__select}>
              <input
                style={{ display: 'none' }}
                type="file"
                name="csv"
                id="fileUpload"
                accept=".csv"
                onChange={handleFileChange}
              />

              <span>Clique no botão abaixo para selecionar um arquivo <b>.csv</b>.</span>
              <label htmlFor="fileUpload">
                SELECIONAR
              </label>


              {warningToUser && (
                <p className={styles.page__content__warning}>{warningToUser}</p>
              )}
            </div>
          )}


          {fileRead && (
            <>
              <div className={styles.page__content__file}>
                <p><b>Nome do arquivo:</b> {fileRead.name}</p>

                <button onClick={clearStates}>Excluir</button>
              </div>


              <div className={styles.page__content__buttons}>
                <button type="submit" className={styles.page__content__validation__button} disabled={!fileRead} onClick={handleValidData}>
                  VALIDAR
                </button>

                <button className={styles.page__content__update__button} disabled={!isValid} onClick={handleUpdatePrices}>
                  ATUALIZAR
                </button>
              </div>

              {productsValidate && productsValidate.length > 0 && (
                <TableProduct products={productsValidate} />
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}