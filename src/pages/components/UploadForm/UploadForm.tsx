import { Spin } from "antd";
import { ChangeEvent, FormEvent, memo, MutableRefObject } from "react";

type Props = {
    loading: boolean;
    refFileName: MutableRefObject<string | null>;
    restFiles: (evt: FormEvent<HTMLFormElement>) => void;
    refInputFiles: MutableRefObject<null>;
    readFile: (evt: ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm = ({ loading, refFileName, refInputFiles, restFiles, readFile }: Props) => {
    return <>
        <form onClick={loading ? evt => evt.preventDefault() : restFiles}>
            <label htmlFor="file-upload" className={loading ? "disabledUpload custom-file-upload" : "custom-file-upload"}>
                {refFileName.current ? refFileName.current : "Выберите файл .mooe"}
            </label>
            <input id="file-upload" ref={refInputFiles} type="file" onChange={loading ? evt => evt.preventDefault() : readFile} />
        </form>
    </>
}

export default memo(UploadForm);