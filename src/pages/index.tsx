import Head from "next/head";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { Button, Form, Input } from 'antd/lib';
import Title from "antd/lib/typography/Title";
import Link from "antd/lib/typography/Link";
import { getJson } from "@/helpers/get/getJson";
import { getYaml } from "@/helpers/get/getYaml";

export default function Home() {

  const [href, setHref] = useState(null);

  const refInputFiles = useRef(null);

  const refFileName = useRef<string | null>(null);

  function readFile(evt: ChangeEvent<HTMLInputElement>) {

    if (!evt.target.files) return;
    if (evt.target.files[0].name.split(".").at(-1) !== "mooe") return;

    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    refFileName.current = file.name;

    reader.onload = async () => {

      const json: JSON = getJson(reader.result as string);


      const doc = getYaml(json);
      

      const file = new Blob([doc as unknown as string], { type: 'application/yaml' });
      const url = URL.createObjectURL(file);

      setHref(url as any);

    };

    reader.onerror = () => {
      console.error(reader.error);
    };

  }

  const restFiles = (evt: FormEvent<HTMLFormElement>) => {
    setHref(null);
    evt.currentTarget.reset();
    refFileName.current = null;
  };

  return (
    <>
      <Head>
        <title>Map converter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"main-container"}>
        <Title>Конвертировать .mooe в .yaml</Title>
        <main className={"main-block"}>

          <form onClick={restFiles}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {refFileName.current ? refFileName.current : "Выберите файл .mooe"}
            </label>
            <input id="file-upload" ref={refInputFiles} type="file" onChange={readFile} />
          </form>
          <Link
            style={{ pointerEvents: `${href ? "auto" : "none"}`, opacity: `${href ? 1 : .5}` }}
            href={`${href ? href : ""}`} download={"output.yaml"}
          >
            <Button type={"primary"}>Скачать .yaml</Button>
          </Link>
        </main>
      </div>
    </>
  );
}
