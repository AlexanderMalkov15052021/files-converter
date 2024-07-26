
export const getJson = (res: string) => {


    const obj = {
        coordinate_system: "reference_image",
        vertices: [0, 1, 2, 3],
        lanes: [[1, 2, "asd", { asd: 123 }], [3, 4, "dsa", { dsa: 321 }], [5, 6, "qaz", { qaz: 111 }]]
    }


    return JSON.parse(JSON.stringify(obj));
}