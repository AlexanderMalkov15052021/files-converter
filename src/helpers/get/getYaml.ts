import YAML from 'yaml';

type MRoad = {
    mLanes: any;
    mStartPosition: { x: number, y: number, z: number },
    mEndPosition: { x: number, y: number, z: number }
}

export const getYaml = (json: JSON) => {

    const strJson = JSON.stringify(json);
    const objJson = JSON.parse(strJson);


    const mMapAttr = objJson.mSceneMap?.mMapAttr;
    const mAreaRect = objJson.mAreas[0]?.mAreaRect;


    const shiftIndex = mAreaRect ? 4 : 0;


    const pointsData = objJson.mRoads.reduce(
        (accum: { lanes: YAML.Document[]; marks: YAML.Document[] }, item: MRoad) => {

            const laneMarks = objJson.mLaneMarks.reduce(
                (laneMarkAccum: { startPos: YAML.Document, endPos: YAML.Document }, laneMark: any) => {

                    if (laneMark.mLaneMarkID === item.mLanes[0].mStartPos) {
                        laneMarkAccum.startPos = new YAML.Document(
                            [laneMark.mLaneMarkXYZW.x, laneMark.mLaneMarkXYZW.y * -1, laneMark.mLaneMarkXYZW.z, ""],
                            { flow: true }
                        );
                    }

                    if (laneMark.mLaneMarkID === item.mLanes[0].mEndPos) {
                        laneMarkAccum.endPos = new YAML.Document(
                            [laneMark.mLaneMarkXYZW.x, laneMark.mLaneMarkXYZW.y * -1, laneMark.mLaneMarkXYZW.z, ""],
                            { flow: true }
                        );
                    }

                    return laneMarkAccum;

                }, {
                startPos: null,
                endPos: null
            });

            const startID = () => {

                const index = accum.marks.findIndex(yaml => {

                    const yamlX = (yaml.contents as any).items[0].value;
                    const yamlY = (yaml.contents as any).items[1].value;
                    const yamlZ = (yaml.contents as any).items[2].value;

                    const startX = (laneMarks.startPos.contents as any).items[0].value;
                    const startY = (laneMarks.startPos.contents as any).items[1].value;
                    const startZ = (laneMarks.startPos.contents as any).items[2].value;

                    return yamlX === startX && yamlY == startY && yamlZ === startZ;
                });

                if (index >= 0) {
                    return index;
                }
                else {
                    return accum.marks.push(laneMarks.startPos) - 1;
                }
            }

            const endID = () => {
                
                const index = accum.marks.findIndex(yaml => {

                    const yamlX = (yaml.contents as any).items[0].value;
                    const yamlY = (yaml.contents as any).items[1].value;
                    const yamlZ = (yaml.contents as any).items[2].value;

                    const startX = (laneMarks.endPos.contents as any).items[0].value;
                    const startY = (laneMarks.endPos.contents as any).items[1].value;
                    const startZ = (laneMarks.endPos.contents as any).items[2].value;

                    return yamlX === startX && yamlY == startY && yamlZ === startZ;
                });

                if (index >= 0) {
                    return index;
                }
                else {
                    return accum.marks.push(laneMarks.endPos) - 1;
                }
            }

            const lane = new YAML.Document(
                [
                    startID() + shiftIndex,
                    endID() + shiftIndex,
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

        mMapAttr.mMapOrigin.x
        mMapAttr.mMapOrigin.y

        const rectPoints = mAreaRect
            ? [
                new YAML.Document(
                    [mMapAttr.mMapOrigin.x, mMapAttr.mMapOrigin.y * -1, mMapAttr.mMapOrigin.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mMapAttr.mMapOrigin.x + mMapAttr.mMapLength, mMapAttr.mMapOrigin.y * -1, mMapAttr.mMapOrigin.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mMapAttr.mMapOrigin.x + mMapAttr.mMapLength, (mMapAttr.mMapOrigin.y + mMapAttr.mMapWidth) * -1, mMapAttr.mMapOrigin.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mMapAttr.mMapOrigin.x, (mMapAttr.mMapOrigin.y + mMapAttr.mMapWidth) * -1, mMapAttr.mMapOrigin.z, ""],
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
                filename: "domodedovo.png"
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
            lanes: pointsData?.lanes ?? [],
            layers: {
                floor: {
                    color: new YAML.Document([1, 0, 0, 0.5], { flow: true }),
                    filename: "domodedovo.png",
                    transform: {
                        scale: 0.05,
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
            vertices: addVertices(pointsData?.marks ?? []),
            walls: {}
        }
    });

    doc.set("lifts", {});

    doc.set("name", "test");


    return doc;
}