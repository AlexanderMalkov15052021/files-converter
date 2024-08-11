import YAML from 'yaml';

type MRoad = {
    mLanes: any;
    mStartPosition: { x: number, y: number, z: number },
    mEndPosition: { x: number, y: number, z: number }
}

const agents_name: string[] = [];

const robotsBornPlaces: any[] = [];

const nearbyWaysData: any[] = [];

const getdistanceToWay = (x_1: number, y_1: number, x_2: number, y_2: number, x_3: number, y_3: number) => {
    const divisible = Math.abs((x_2 - x_1) * (y_1 - y_3) - (x_1 - x_3) * (y_2 - y_1));
    const divider = Math.sqrt(Math.pow((x_2 - x_1), 2) + Math.pow((y_2 - y_1), 2));
    return divisible / divider;
}

const getMarksParams = (mark: any, index: number) => {

    if (mark.mLaneMarkType === 11 && mark.mLaneMarkName.includes("charge")) {

        const name = mark.mLaneMarkName.replace("charge0", "");

        const robotName = `tinyRobot${name}`;

        agents_name.push(robotName);

        robotsBornPlaces.push(mark);

        nearbyWaysData.push({
            laneIndex: null,
            markIndex: index,
            distance: null
        });

        return [
            mark.mLaneMarkXYZW.x,
            mark.mLaneMarkXYZW.y * -1,
            mark.mLaneMarkXYZW.z,
            mark.mLaneMarkName,
            {
                dock_name: [1, `dock_${name}`],
                is_charger: [4, true],
                is_holding_point: [4, true],
                is_parking_spot: [4, true],
                spawn_robot_name: [1, robotName],
                spawn_robot_type: [1, "TinyRobot"]
            }
        ];
    }


    if (mark.mLaneMarkType === 11) {

        robotsBornPlaces.push(mark);

        nearbyWaysData.push({
            laneIndex: null,
            markIndex: index,
            distance: null
        });

        return [
            mark.mLaneMarkXYZW.x,
            mark.mLaneMarkXYZW.y * -1,
            mark.mLaneMarkXYZW.z,
            mark.mLaneMarkName
        ];
    }


    return [
        mark.mLaneMarkXYZW.x,
        mark.mLaneMarkXYZW.y * -1,
        mark.mLaneMarkXYZW.z,
        ""
    ];

}

export const getYaml = (json: JSON) => {
    console.log("start");

    const strJson = JSON.stringify(json);
    const objJson = JSON.parse(strJson);


    const mMapAttr = objJson.mSceneMap?.mMapAttr;
    const mAreaRect = objJson.mAreas[0]?.mAreaRect;


    const shiftIndex = mAreaRect ? 4 : 0;


    const targetLaneMarks = objJson.mLaneMarks.map((mark: any, index: number) => {
        return {
            id: mark.mLaneMarkID,
            mark: new YAML.Document(
                getMarksParams(mark, index),
                { flow: true }
            )
        };
    });



    const lanes = objJson.mRoads.map(
        (item: any) => {

            const indexes = targetLaneMarks.reduce(
                (accumIndexes: { start: number, end: number }, laneMarksObj: any, index: number) => {

                    (laneMarksObj.id === item.mLanes[0].mStartPos) && (accumIndexes.start = index);


                    (laneMarksObj.id === item.mLanes[0].mEndPos) && (accumIndexes.end = index);


                    return accumIndexes;

                }, {
                start: null,
                end: null
            });

            return new YAML.Document(
                [
                    item.mLanes[0].mDirection === 2 ? indexes.end + shiftIndex : indexes.start + shiftIndex,
                    item.mLanes[0].mDirection === 2 ? indexes.start + shiftIndex : indexes.end + shiftIndex,
                    {
                        bidirectional: item.mLanes[0].mDirection === 0 ? [4, true] : [4, false],
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

        }
    );


    const doc = new YAML.Document();


    const addVertices = (marks: YAML.Document[]) => {
        if (!objJson.mLaneMarks.length) return [];

        const rectPoints = mMapAttr
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






    /*start*/

    let currentLanes = lanes;

    robotsBornPlaces.map((place: any, ind: number) => {

        currentLanes.map((lane: any, index: number) => {

            const point_1 = objJson.mLaneMarks[lane.contents.items[0].value - shiftIndex].mLaneMarkXYZW;
            const point_2 = objJson.mLaneMarks[lane.contents.items[1].value - shiftIndex].mLaneMarkXYZW;

            const x_1 = point_1.x;
            const y_1 = point_1.y;

            const x_2 = point_2.x;
            const y_2 = point_2.y;

            const x_3 = place.mLaneMarkXYZW.x;
            const y_3 = place.mLaneMarkXYZW.y;

            const distance = getdistanceToWay(x_1, y_1, x_2, y_2, x_3, y_3);

            if (nearbyWaysData[ind].distance > distance || nearbyWaysData[ind].distance === null) {

                nearbyWaysData[ind].distance = distance;
                nearbyWaysData[ind].laneIndex = index;

            }

        });

        const startPointIndex = currentLanes[nearbyWaysData[ind].laneIndex].contents.items[0].value;
        const endPointIndex = currentLanes[nearbyWaysData[ind].laneIndex].contents.items[1].value;

        const bidirectional = currentLanes[nearbyWaysData[ind].laneIndex].contents.items[2].items[0].value.items[1].value;


        const lane_1 = new YAML.Document(
            [
                startPointIndex,
                nearbyWaysData[ind].markIndex,
                {
                    bidirectional: [4, bidirectional],
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

        const lane_2 = new YAML.Document(
            [
                nearbyWaysData[ind].markIndex,
                endPointIndex,
                {
                    bidirectional: [4, bidirectional],
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


        currentLanes = [
            ...currentLanes.filter((_: any, index: number) => index !== nearbyWaysData[ind].laneIndex),
            lane_1,
            lane_2
        ];

    });

    /*end*/






    doc.set("coordinate_system", "reference_image");

    doc.set("crowd_sim", {
        agent_groups: [
            new YAML.Document({ agents_name, agents_number: 3, group_id: 0, profile_selector: "external_agent", state_selector: "external_static", x: 0, y: 0 }, { flow: true })
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
            lanes: currentLanes ?? [],
            layers: {
                floor: {
                    color: new YAML.Document([1, 0, 0, 0.5], { flow: true }),
                    filename: "domodedovo.png",
                    transform: {
                        scale: objJson.mSceneMap?.mGridMsg.info.resolution ?? 0.05,
                        translation_x: 0,
                        translation_y: 0,
                        yaw: 0
                    },
                    visible: true
                }
            },
            measurements: mMapAttr ? [
                new YAML.Document([0, 1, { distance: [3, mMapAttr.mMapLength] }], { flow: true })
            ] : [],
            vertices: addVertices(targetLaneMarks ? targetLaneMarks.map((obj: any) => obj.mark) : []),
            walls: {}
        }
    });

    doc.set("lifts", {});

    doc.set("name", "domodedovo");

    console.log("end");

    return doc;
}