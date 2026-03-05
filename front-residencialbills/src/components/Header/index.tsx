import Link from "next/link";
import styles from "./styles.module.scss";

import Image from "next/image";

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/" legacyBehavior>
                    <Image src="/casa-b-100.png" width={60} height={60} alt="Painel" />
                </Link>

                <nav className={styles.menuNav}>
                    <Link href="/categories" legacyBehavior>
                        <a>Categorias</a>
                    </Link>

                    <Link href="/transactions" legacyBehavior>
                        <a>Transações</a>
                    </Link>

                    <Link href="/people" legacyBehavior>
                        <a>Pessoas</a>
                    </Link>
                </nav>

            </div>
        </header>
    );
}