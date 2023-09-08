import styles from './styles.module.css'

interface Props {
  title: string
}

export function Header({ title }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <h2>{title}</h2>
      </div>
    </header>
  )
}