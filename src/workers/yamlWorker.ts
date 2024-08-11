import { getYaml } from '@/helpers/get/getYaml';

const ctx: Worker = self as any;

const sendYaml = (evt: any) => {

    const doc = getYaml(evt.data.result);

    const file = new Blob([doc as unknown as string], { type: 'application/yaml' });
    const url = URL.createObjectURL(file);

    ctx.postMessage({ url });
}

ctx.addEventListener("message", sendYaml);