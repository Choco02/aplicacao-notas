import type { NextPage } from "next";
import Head from "next/head";
import Popup from "reactjs-popup";
import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import { api } from "../api";

import styles from "../styles/Home.module.css";

const cardData: { id: number; text: string; title: string }[] = [];

const Home: NextPage = () => {
  const router = useRouter();

  const handleAddPost = async () => {
    //@ts-ignore
    const [ title, text ]: string[] = [ titleRef.current.value, textRef.current.value ];

    if (title && text) {
      console.log(title, text);
      const res = await api.post('/create-post', { title, text });
      console.log(res);

      const { id, title: t, text: txt } = res.data;
      const newData = [...cardDataState];
      newData.push({ id, title: t, text: txt });
      setCardDataState(newData);
    }
  }

  const handleDelete = async (item: { id: number; text: string; title: string }) => {
    console.log(cardDataState);
    const deletedPost = await api.delete('/delete-post/'+item.id);
    const newData = cardDataState.filter((i) => i.id !== item.id);
    console.log("newData: ", newData);
    console.log(deletedPost);
    setCardDataState(newData);
  };

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => {
        console.log(res);
        const posts = res.data;
        posts.push({ id: 'novo', text: "", title: "Novo" });
        setCardDataState(posts);
      })
      .catch(() => router.push("/login", undefined, { shallow: true }));
  }, [router]);

  const [cardDataState, setCardDataState] = useState(cardData);

  const [ titleRef, textRef ] = [ useRef(null), useRef(null) ];
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Notas</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form className={styles.form}>
          {cardDataState.map((item) =>
            item.title === "Novo" ? (
              <a
                href="#"
                id={`${item.id}`}
                key={item.id}
                className={styles.card}
              >
                <Popup
                  trigger={
                    <p
                      style={{
                        fontSize: "50px",
                        textAlign: "center",
                        minWidth: "100px",
                      }}
                    >
                      +
                    </p>
                  }
                  position="right center"
                >
                  <form className={styles.formPost} >
                    <input
                      placeholder="Insira um título"
                      className={styles.input}
                      defaultValue="Título"
                      ref={titleRef}
                    />
                    <input
                      placeholder="Insira um conteúdo aqui"
                      className={styles.input}
                      defaultValue="Texto"
                      ref={textRef}
                    />
                    <br />
                    <br />

                    <div>
                      <input
                        type="button"
                        onClick={handleAddPost}
                        className={styles.button}
                        value="Criar post"
                      />
                    </div>
                  </form>
                </Popup>
              </a>
            ) : (
              <a href="#" key={item.id} className={styles.card}>
                <h2>{item.title}</h2>
                <p onClick={() => handleDelete(item)} className={styles.delete}>
                  X
                </p>
                <p>{item.text}</p>
              </a>
            )
          )}
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Choco02"
          target="_blank"
          rel="noopener noreferrer"
        >
          Projeto disponível no github{" "}
        </a>
      </footer>
    </div>
  );
};

export default Home;
