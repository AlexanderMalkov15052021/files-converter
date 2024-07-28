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
    const mMapResolution = objJson.mSceneMap?.mMapAttr?.mMapResolution;
    const mapRotateAngle = objJson.mapRotateAngle;


    const shiftIndex = mAreaRect ? 4 : 0;


    const pointsData = objJson.mRoads.reduce(
        (accum: { lanes: YAML.Document[]; marks: YAML.Document[]; }, item: MRoad) => {

            const containsIndexes = accum.marks.reduce((
                accumIndexMarks: { startIndexMark: number | null, endIndexMark: number | null },
                currentMark: YAML.Document,
                index: number
            ) => {

                const currX = (currentMark.contents as any).items[0].value;
                const currY = (currentMark.contents as any).items[1].value;
                const currZ = (currentMark.contents as any).items[2].value;

                (item.mStartPosition.x === currX &&
                    item.mStartPosition.y === currY &&
                    item.mStartPosition.z === currZ
                ) && (accumIndexMarks.startIndexMark = index);

                (item.mEndPosition.x === currX &&
                    item.mEndPosition.y === currY &&
                    item.mEndPosition.z === currZ
                ) && (accumIndexMarks.endIndexMark = index);

                return accumIndexMarks;
            }, {
                startIndexMark: null,
                endIndexMark: null
            });

            const laneIndexStart = containsIndexes.startIndexMark ?? (accum.marks.push(new YAML.Document(
                [item.mStartPosition.x, item.mStartPosition.y * -1, item.mStartPosition.z, ""],
                { flow: true }
            )) - 1);

            const laneIndexEnd = containsIndexes.endIndexMark ?? (accum.marks.push(new YAML.Document(
                [item.mEndPosition.x, item.mEndPosition.y * -1, item.mEndPosition.z, ""],
                { flow: true }
            )) - 1);


            const lane = new YAML.Document(
                [
                    laneIndexStart + shiftIndex,
                    laneIndexEnd + shiftIndex,
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
                    [mAreaRect.topLeftPoint.x, mAreaRect.topLeftPoint.y * -1, mAreaRect.topLeftPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.topRightPoint.x, mAreaRect.topRightPoint.y * -1, mAreaRect.topRightPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.bottomRightPoint.x, mAreaRect.bottomRightPoint.y * -1, mAreaRect.bottomRightPoint.z, ""],
                    { flow: true }
                ),
                new YAML.Document(
                    [mAreaRect.bottomLeftPoint.x, mAreaRect.bottomLeftPoint.y * -1, mAreaRect.bottomLeftPoint.z, ""],
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
                        // scale: mMapResolution ?? 0.05,
                        translation_x: 0,
                        translation_y: 0,
                        yaw: 0
                        // yaw: mapRotateAngle ?? 0
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