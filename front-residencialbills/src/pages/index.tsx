import Head from "next/head";
import { Header } from "../components/Header/index";
import styles from "../styles/lists.module.scss";
import Modal from "react-modal";


export default function Dashboard() {

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Dashboard - Residencial Bills</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Seja ben-vindo ao Residencial Bills</h1>
          </div>

          <article className={styles.listItens}>
              <span className={styles.emptyList}>
                Acesse as categorias, transações e pessoas utilizando o menu acima para navegar.
              </span>
          </article>
        </main>


      </div>
    </>
  );
}