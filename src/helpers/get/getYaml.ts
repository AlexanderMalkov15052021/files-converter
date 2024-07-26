import YAML from 'yaml';

export const getYaml = (json: JSON) => {

    const strJson = JSON.stringify(json);
    const objJson = JSON.parse(strJson);

    const doc = new YAML.Document();



    doc.set("coordinate_system", "reference_image");

    const vertices = new YAML.Document(objJson["vertices"], { flow: true });
    doc.set("vertices", vertices);

    const lanes = objJson["lanes"].map((item: any) => {
        return new YAML.Document(item, { flow: true });
    });
    doc.set("lanes", [...lanes]);



    return doc;
}