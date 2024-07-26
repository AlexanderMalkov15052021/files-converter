import YAML from 'yaml';

export const getYaml = (json: JSON) => {

    const strJson = JSON.stringify(json);
    const objJson = JSON.parse(strJson);



    const mAreaRect = objJson.mAreas[0]?.mAreaRect;



    const doc = new YAML.Document();



    doc.set("coordinate_system", "reference_image");

    doc.set("crowd_sim", {
        agent_groups: [
            new YAML.Document({ agents_name: ["tinyRobot2", "tinyRobot1", "tinyRobot3", "tinyRobot4", "tinyRobot5", "tinyRobot6", "tinyRobot7", "tinyRobot8", "tinyRobot9", "tinyRobot10", "tinyRobot11", "tinyRobot12", "tinyRobot13", "tinyRobot14", "tinyRobot15", "tinyRobot16", "tinyRobot17", "tinyRobot18", "tinyRobot19", "tinyRobot20", "tinyRobot21"], agents_number: 21, group_id: 0, profile_selector: "external_agent", state_selector: "external_static", x: 0, y: 0 }, { flow: true })
        ],
        agent_profiles: [
            new YAML.Document({ ORCA_tau: 1, ORCA_tauObst: 0.40000000000000002, class: 1, max_accel: 0, max_angle_vel: 0, max_neighbors: 10, max_speed: 0, name: "external_agent", neighbor_dist: 5, obstacle_set: 1, pref_speed: 0, r: 0.25 }, { flow: true })
        ],
        enable: 0,
        goal_sets: [],
        model_types: [],
        obstacle_set: new YAML.Document({ class: 1, file_name: "L1_navmesh.nav", type: "nav_mesh" }, { flow: true }),
        states: [new YAML.Document({ final: 1, goal_set: -1, name: "external_static", navmesh_file_name: "" }, { flow: true })],
        transitions: [],
        update_time_step: 0.10000000000000001
    });

    doc.set("graphs", {});

    doc.set("levels", {
        L1: {
            drawing: {
                filename: "test.png"
            },
            elevation: 0,
            fiducials: [
                new YAML.Document([0, 0, ""], { flow: true })
            ],
            floors: [
                { vertices: new YAML.Document([0, 1, 2, 3], { flow: true }) }
            ],
            lanes: {},
            layers: {},
            measurements: {},
            vertices: mAreaRect ? [
                new YAML.Document(
                    [mAreaRect.topLeftPoint.x, mAreaRect.topLeftPoint.y, mAreaRect.topLeftPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.topRightPoint.x, mAreaRect.topRightPoint.y, mAreaRect.topRightPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.bottomRightPoint.x, mAreaRect.bottomRightPoint.y, mAreaRect.bottomRightPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.bottomLeftPoint.x, mAreaRect.bottomLeftPoint.y, mAreaRect.bottomLeftPoint.z, ""],
                    { flow: true }
                ),
            ] : [],
            walls: {}
        }
    });

    doc.set("lifts", {});

    doc.set("name", "test");





    // const vertices = new YAML.Document(objJson["vertices"], { flow: true });
    // doc.set("vertices", vertices);

    // const lanes = objJson["lanes"].map((item: any) => {
    //     return new YAML.Document(item, { flow: true });
    // });
    // doc.set("lanes", [...lanes]);



    return doc;
}