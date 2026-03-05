import Head from "next/head";
import { Header } from "../../components/Header/index";
import styles from "../../styles/lists.module.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import { useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Person = {
  id: number;
  name: string;
  age: string;
};

interface HomeProps {
  peopleItems: Person[];
}

export default function People({ peopleItems }: HomeProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchPeople() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/people");
    setPeople(response.data);
  }

  useEffect(() => {
    fetchPeople();
  }, []);

  async function handleRefreshPeople() {
    fetchPeople();
  }

  async function handleSubmitPerson(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiClient = setupAPIClient();

    try {
    if (editingId === null) {
      await apiClient.post("/people", { name, age });
      toast.success("Adicionado com sucesso.");
    } else {
      await apiClient.put(`/people/${editingId}`, { id: editingId, name, age });
      toast.success("Atualizado com sucesso.");
    }

    // Limpa o formulário
    setName("");
    setAge("");
    setEditingId(null);

    // Atualiza a lista de pessoas
    fetchPeople();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Falha ao salvar.";
    toast.error(message);
  }
  }
  
  function handleEditPerson(person: Person) {
    setName(person.name);
    setAge(person.age);
    setEditingId(person.id);
  }

  function handleCancelEditPerson() {
    setName("");
    setAge("");
    setEditingId(null);
  }

  async function handleExcludePerson(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?")) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.delete(`/people/${id}`);
      toast.success("Removido com sucesso")
      fetchPeople();
    } catch (error: any) {
      const message =
      error?.response?.data?.message ||
      error?.message || "Falha ao remover.";
      toast.error(message);
    }
  }

  function getAgeVariant(age: string) {
  const ageNumber = Number(age);
  if (Number.isNaN(ageNumber)) return "unknown";
  return ageNumber < 18 ? "minor" : "adult";
}

  return (
    <>
      <Head>
        <title>Pessoas - Residencial Bills</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Pessoas</h1>
            <button onClick={handleRefreshPeople}>
              <FiRefreshCcw size={25} color="#3FFFA3" />
            </button>
          </div>

          <form onSubmit={handleSubmitPerson} className={styles.form}>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Idade"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />

            <button type="submit">
              {editingId === null ? "Adicionar Pessoa" : "Salvar Alterações"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={handleCancelEditPerson} className={styles.cancelButton}>
                Cancelar
              </button>
            )}
          </form>

          <article className={styles.listItems}>
          {people.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma pessoa foi encontrada...
              </span>
            )}

            {people.map((item) => (
              <section key={item.id} className={styles.listItem}>
                <div className={styles.tag}></div>
                <div className={styles.itemContent}>
                  <span className={styles.description}>{item.name}</span>
                  <span className={styles.badge} data-age-variant={getAgeVariant(item.age)}>
                    {item.age} anos
                  </span>
                </div>
                <button onClick={() => handleEditPerson(item)} className={styles.editButton}>
                  <FiEdit2 size={18} /> Editar
                </button>
                <button onClick={() => handleExcludePerson(item.id)} className={styles.deleteButton}>
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