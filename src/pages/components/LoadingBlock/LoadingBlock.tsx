import { Spin } from "antd";
import { memo } from "react";

const LoadingBlock = ({ time }: { time: number[] }) => {
    return <>
        <p className={"converting"}>Конвертирование файла...</p>
        <div className={"counter"}>
            <span style={{ color: "rgba(0, 0, 0, 0.88)" }}>{time[0]}</span>
            <span> - мин. : </span>
            <span style={{ color: "rgba(0, 0, 0, 0.88)" }}>{time[1]}</span>
            <span> - сек.</span>
        </div>
        <Spin />
    </>
}

export default memo(LoadingBlock);