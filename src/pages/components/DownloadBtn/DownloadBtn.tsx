import { Button } from "antd";
import Link from "antd/lib/typography/Link";
import { memo } from "react";

const DownloadBtn = ({ href }: { href: string | null }) => {
    return <>
        <Button className="buttun-upload" disabled={href ? false : true} type={"primary"}>
            <Link
                href={`${href ? href : ""}`} download={"domodedovo.building.yaml"}
            >
                Скачать .yaml
            </Link>
        </Button>
    </>
}

export default memo(DownloadBtn);