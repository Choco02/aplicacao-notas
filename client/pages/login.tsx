import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import styles from "../styles/Login.module.css";
import { api } from "./api/api";

const Login: NextPage = () => {
  const router = useRouter();

  const handleSubmit = (action: string) => {
    //@ts-ignore
    const [email, password]: string[] = [ emailRef.current.value, passwordRef.current.value ];
    console.log(email, password);
    console.log("action: ", action);

    api
      .post("/" + action, { email, password })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          api.defaults.headers.common.authorization = `Bearer ${res.data.token}`;
          router.push("/", undefined, { shallow: true });
        }
      })
      .catch(() => alert("Verifique os dados e tente novamente"));
  };

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Notas</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form className={styles.form}>
          <input
            name="email"
            placeholder="email"
            type="email"
            className={styles.input}
            defaultValue="exemplo@exemplo.com"
            ref={emailRef}
          />
          <input
            name="password"
            placeholder="senha"
            type="password"
            className={styles.input}
            defaultValue="abcdef"
            ref={passwordRef}
          />
          <br />
          <br />

          <div>
            <input
              type="button"
              onClick={() => handleSubmit("account-create")}
              className={styles.button}
              value="Cadastrar"
            />
            <input
              type="button"
              onClick={() => handleSubmit("login")}
              className={styles.button}
              value="Login"
            />
          </div>
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

export default Login;
