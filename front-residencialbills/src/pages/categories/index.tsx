import Head from "next/head";
import { Header } from "../../components/Header/index";
import styles from "../../styles/lists.module.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import { useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Category = {
  id: number;
  description: string;
  purpose: "despesa" | "receita" | "ambas";
};

interface HomeProps {
  categoriesItems: Category[];
}

export default function Categories({ categoriesItems }: HomeProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState<"despesa" | "receita" | "ambas">("despesa");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchCategories() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/categories");

    setCategories(response.data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  
  async function handleRefreshCategories() {
    fetchCategories();
  }

  async function handleSubmitCategory(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiClient = setupAPIClient();

    try {
      
      if (editingId === null) {
        // Cria nova categoria
        await apiClient.post("/categories", {
          description,
          purpose,
        });
        toast.success("Criado com sucesso!");
      } else {
        // Edita categoria existente
        await apiClient.put(`/categories/${editingId}`, {
          id: editingId,
          description,
          purpose
        })
        toast.success("Atualizado com sucesso!");
      }
      
      // Limpa o formulário
      setDescription("");
      setPurpose("despesa");
      setEditingId(null);
      
      // Atualiza a lista de categorias
      fetchCategories();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Falha ao salvar.";
        toast.error(message);
    }
  }

  function handleEditCategory(category: Category) {
    setDescription(category.description);
    setPurpose(category.purpose);
    setEditingId(category.id);
  }

  function handleCancelEditCategory() {
    setDescription("");
    setPurpose("despesa");
    setEditingId(null);
  }

  async function handleExclude(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.delete(`/categories/${id}`);
      toast.success("Removido com sucesso.");
      fetchCategories();
    } catch (error: any) {
      const message =
      error?.response?.data?.message ||
      error?.message || "Falha ao remover.";
      toast.error(message);
    }
  }

  return (
    <>
      <Head>
        <title>Categorias - Residencial Bills</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Categorias</h1>
            <button onClick={handleRefreshCategories}>
              <FiRefreshCcw size={25} color="#3FFFA3" />
            </button>
          </div>

          <form onSubmit={handleSubmitCategory} className={styles.form}>
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as "despesa" | "receita" | "ambas")}
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
              <option value="ambas">Ambas</option>
            </select>

            <button type="submit">
              {editingId === null ? "Adicionar Categoria" : "Salvar Alterações"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={handleCancelEditCategory} className={styles.cancelButton}>
                Cancelar
              </button>
            )}
          </form>

          <article className={styles.listItems}>
          {categories.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma categoria foi encontrada...
              </span>
            )}

            {categories.map((item) => (
              <section key={item.id} className={styles.listItem}>
                <div className={styles.tag}></div>
                <div className={styles.itemContent}>
                  <span className={styles.badge} data-purpose={item.purpose}>
                    {item.purpose === "despesa" ? "Despesa" : item.purpose === "receita" ? "Receita" : "Ambas"}
                  </span>
                  <span className={styles.description}>{item.description}</span>
                </div>
                <button onClick={() => handleEditCategory(item)} className={styles.editButton}>
                  <FiEdit2 size={18} /> Editar
                </button>
                <button onClick={() => handleExclude(item.id)} className={styles.deleteButton}>
                  <FiTrash2 size={18} /> Excluir
                </button>
              </section>
            ))}
          </article>
        </main>
      </div>
    </>
  );
}