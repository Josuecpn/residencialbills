import Head from "next/head";
import { Header } from "../../components/Header/index";
import styles from "../../styles/lists.module.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Transaction = {
  id: number;
  description: string;
  value: number;
  type: "despesa" | "receita";
  category: Category;
  person: Person;
};

type Category = {
  id: number;
  description: string;
  purpose: "despesa" | "receita" | "ambas";
};

type Person = {
  id: number;
  name: string;
  age: string;
};

interface HomeProps {
  transactionItems: Transaction[];
}

export default function Transactions({ transactionItems }: HomeProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"despesa" | "receita">("despesa");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchTransactions() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/transactions");
    setTransactions(response.data);
  }

  async function fetchCategories() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/categories");
    setCategories(response.data);
  }

  async function fetchPeople() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/people");
    setPeople(response.data);
  }

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchPeople();
  }, []);

  // Quando seleciona uma pessoa menor, força o tipo para "despesa"
  useEffect(() => {
    if (selectedPersonId) {
      const person = people.find(p => p.id === selectedPersonId);
      if (person && Number(person.age) < 18) {
        setType("despesa");
      }
    }
  }, [selectedPersonId, people]);

  async function handleRefreshTransactions() {
    fetchTransactions();
  }

  async function handleSubmitTransaction(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validações básicas
    if (!selectedPersonId || !selectedCategoryId) {
      toast.error("Pessoa e categoria são obrigatórios.");
      return;
    }

    const person = people.find(p => p.id === selectedPersonId);
    const category = categories.find(c => c.id === selectedCategoryId);

    if (!person || !category) {
      toast.error("Pessoa ou categoria selecionada é inválida.");
      return;
    }

    // Verifica restrição de categoria para menores de idade
    const age = Number(person.age);
    if (age < 18 && type !== "despesa") {
      toast.error("Menores de idade só podem cadastrar transações de despesa");
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      toast.error("Valor inválido.");
      return;
    }

    const apiClient = setupAPIClient();

    try {
      if (editingId === null) {
        await apiClient.post("/transactions", {
          description,
          value: numericValue,
          type,
          categoryId: selectedCategoryId,
          personId: selectedPersonId
        });
        toast.success("Criado com sucesso.");
      } else {
        await apiClient.put(`/transactions/${editingId}`, {
          id: editingId,
          description,
          value: numericValue,
          type,
          categoryId: selectedCategoryId,
          personId: selectedPersonId
        });
        toast.success("Atualizado com sucesso.");
      }

      // Limpar e recarregar
      setDescription("");
      setValue("");
      setType("despesa");
      setSelectedCategoryId(null);
      setSelectedPersonId(null);
      setEditingId(null);
      fetchTransactions();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Falha ao salvar.";
      toast.error(message);
    }
  }


  function handleEditTransaction(transaction: Transaction) {
    setDescription(transaction.description);
    setValue(transaction.value.toString());
    setType(transaction.type);
    setSelectedCategoryId(transaction.category.id);
    setSelectedPersonId(transaction.person.id);
    setEditingId(transaction.id);
  }

  function handleCancelEditTransaction() {
    setDescription("");
    setValue("");
    setType("despesa");
    setSelectedCategoryId(null);
    setSelectedPersonId(null);
    setEditingId(null);
  }

  async function handleExcludeTransaction(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.delete(`/transactions/${id}`);
      toast.success("Removido com sucesso")
      fetchTransactions();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message || "Falha ao remover.";
      toast.error(message);
    }
  }

  const availableCategories = useMemo(() => {
    if (!selectedPersonId) return categories;

    const selectedPerson = people.find((p) => p.id === selectedPersonId);
    if (!selectedPerson) return categories;

    const age = Number(selectedPerson.age);
    const isMinor = age < 18;

    if (isMinor) {
      // Menor de idade: só categorias de despesa
      return categories.filter(cat => cat.purpose === "despesa");
    }

    // Maior de idade: mostra todas as categorias disponíveis
    return categories;
  }, [selectedPersonId, categories, people]);

  return (
    <>
      <Head>
        <title>Transações - Residencial Bills</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Transações</h1>
            <button onClick={handleRefreshTransactions}>
              <FiRefreshCcw size={25} color="#3FFFA3" />
            </button>
          </div>

          <form onSubmit={handleSubmitTransaction} className={styles.form}>
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Valor"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />

            <select
              value={selectedPersonId || ""}
              onChange={(e) => setSelectedPersonId(Number(e.target.value))}
              required
            >
              <option value="">Selecione uma pessoa</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name} ({person.age} anos)
                </option>
              ))}
            </select>

            {selectedPersonId && people.find(p => p.id === selectedPersonId && Number(p.age) < 18) && (
              <div className={styles.warningMessage}>
                ⚠️ Menor de idade: apenas despesas permitidas
              </div>
            )}
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "despesa" | "receita")}
              disabled={selectedPersonId !== null && people.find(p => p.id === selectedPersonId && Number(p.age) < 18) !== undefined}
            >
              {selectedPersonId && people.find(p => p.id === selectedPersonId && Number(p.age) < 18) ? (
                <option value="despesa">Despesa</option>
              ) : (
                <>
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                </>
              )}
            </select>

            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              required
              disabled={!selectedPersonId}
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.description} ({cat.purpose})
                </option>
              ))}
            </select>

            <button type="submit">
              {editingId === null ? "Adicionar Transação" : "Salvar Alterações"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={handleCancelEditTransaction} className={styles.cancelButton}>
                Cancelar
              </button>
            )}
          </form>

          <article className={styles.listItems}>
            {transactions.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma transação foi encontrada...
              </span>
            )}

            {transactions.map((item) => (
              <section key={item.id} className={styles.listItem}>
                <div className={styles.tag}></div>
                <div className={styles.itemContent}>
                  <span className={styles.description}>
                    {item.description} <br /> {item.person.name} - R$ {item.value}
                  </span>
                </div>
                <button onClick={() => handleEditTransaction(item)} className={styles.editButton}>
                  <FiEdit2 size={18} /> Editar
                </button>
                <button onClick={() => handleExcludeTransaction(item.id)} className={styles.deleteButton}>
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