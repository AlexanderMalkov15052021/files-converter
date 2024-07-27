import YAML from 'yaml';

type MRoad = {
    mStartPosition: { x: number, y: number, z: number },
    mEndPosition: { x: number, y: number, z: number }
}

export const getYaml = (json: JSON) => {

    const strJson = JSON.stringify(json);
    const objJson = JSON.parse(strJson);




    const mMapAttr = objJson.mSceneMap?.mMapAttr;
    const mAreaRect = objJson.mAreas[0]?.mAreaRect;




    const pointsData = objJson.mRoads.reduce(
        (accum: { lanes: YAML.Document[]; marks: YAML.Document[]; }, item: MRoad) => {



            const startPos = new YAML.Document(
                [item.mStartPosition.x, item.mStartPosition.y, item.mStartPosition.z, ""],
                { flow: true }
            );

            const endtPos = new YAML.Document(
                [item.mEndPosition.x, item.mEndPosition.y, item.mEndPosition.z, ""],
                { flow: true }
            );

            accum.marks.push(startPos, endtPos);

            const lane = new YAML.Document(
                [
                    accum.marks.length - 2,
                    accum.marks.length - 1,
                    {
                        bidirectional: [4, true],
                        demo_mock_floor_name: [1, ""],
                        demo_mock_lift_name: [1, ""],
                        graph_idx: [2, 0],
                        mutex: [1, ""],
                        orientation: [1, ""],
                        speed_limit: [3, 0]
                    }
                ],
                { flow: true }
            );

            accum.lanes.push(lane);

            return accum;
        },
        {
            lanes: [],
            marks: []
        },
    );







    const doc = new YAML.Document();






    const addVertices = (marks: YAML.Document[]) => {
        if (!objJson.mLaneMarks.length) return [];

        const rectPoints = mAreaRect
            ? [
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
                )
            ]
            : null;

        const res = [rectPoints, marks].filter(item => item);

        return res.flat();
    }




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
            ...(mAreaRect && {
                floors: [
                    { parameters: new YAML.Document({ ceiling_scale: [3, 1], ceiling_texture: [1, "blue_linoleum"], indoor: [2, 0], texture_name: [1, "blue_linoleum"], texture_rotation: [3, 0], texture_scale: [3, 1] }, { flow: true }), vertices: new YAML.Document([0, 1, 2, 3], { flow: true }) }
                ]
            }),
            lanes: pointsData.lanes,
            layers: {
                floor: {
                    color: new YAML.Document([1, 0, 0, 0.5], { flow: true }),
                    filename: "test.png",
                    transform: {
                        scale: 0.049700000000000001,
                        translation_x: 0,
                        translation_y: 0,
                        yaw: 0
                    },
                    visible: true
                }
            },
            measurements: mMapAttr ? [
                new YAML.Document([0, 1, { distance: [3, mMapAttr.mMapWidth] }], { flow: true }),
                new YAML.Document([0, 3, { distance: [3, mMapAttr.mMapLength] }], { flow: true })
            ] : [],
            vertices: addVertices(pointsData.marks),
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