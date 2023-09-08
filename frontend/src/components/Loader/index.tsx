import styles from './styles.module.css'

export function Loader(){
  return (
    <div className={styles.container}>
      <span className={styles.container__loader}/>
    </div>
  )
}