import Head from "next/head";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { Button, Image, Spin } from 'antd/lib';
import Title from "antd/lib/typography/Title";
import Link from "antd/lib/typography/Link";
import { getJson } from "@/helpers/get/getJson";
import { getYaml } from "@/helpers/get/getYaml";

export default function Home() {

  const [href, setHref] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [isMessageShow, setIsMessageShow] = useState<boolean>(false);


  const refInputFiles = useRef(null);

  const refFileName = useRef<string | null>(null);


  function readFile(evt: ChangeEvent<HTMLInputElement>) {

    if (!evt.target.files) return;

    if (evt.target.files[0].name.split(".").at(-1) !== "mooe") {
      setIsMessageShow(true);
      return
    };

    setLoading(true);

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

      setLoading(false);

    };

    reader.onerror = () => {
      console.error(reader.error);
    };

  }

  const restFiles = (evt: FormEvent<HTMLFormElement>) => {
    setHref(null);
    setIsMessageShow(false);
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
        <Image preview={false} style={{ width: "50vw", maxWidth: "500px" }} src="img/svg/ak.svg"></Image>
        <Title className={"h1"}><div>Конвертировать</div><div>.mooe в .yaml</div></Title>
        <main className={"main-block"}>

          <form onClick={restFiles}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {refFileName.current ? refFileName.current : "Выберите файл .mooe"}
            </label>
            <input id="file-upload" ref={refInputFiles} type="file" onChange={readFile} />
          </form>

          {isMessageShow && <p className={"message"}>Необходим файл с расширением .mooe!</p>}

          {loading && <p className={"converting"}>Конвертирование файла...</p>}

          {loading ? <Spin /> : <Button className="buttun-upload" disabled={href ? false : true} type={"primary"}>
            <Link
              href={`${href ? href : ""}`} download={"building.yaml"}
            >
              Скачать .yaml
            </Link>
          </Button>}

        </main>
      </div>
    </>
  );
}
