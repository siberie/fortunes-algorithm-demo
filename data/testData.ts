import Vector2 from "../src/core/types/Vector2";

// export const sites = [
//     {index: 0, position: new Vector2(260, 200), face: null},
//     {index: 1, position: new Vector2(260, 250), face: null},
//     {index: 2, position: new Vector2(260, 400), face: null},
// ]

// export const sites = [
//     {index: 0, position: new Vector2(100, 200), face: null},
//     {index: 1, position: new Vector2(200, 200), face: null},
//     {index: 2, position: new Vector2(300, 200), face: null},
// ]
// export const sites = [
//     {index: 0, position: new Vector2(51, 190), face: null, color: "yellow"},
//     {index: 1, position: new Vector2(170, 200), face: null, color: "lightgreen"},
//     {index: 2, position: new Vector2(300, 211), face: null, color: "orange"},
//     {index: 3, position: new Vector2(150, 330), face: null, color: "pink"},
// ]

// export const sites = [
//     {index: 0, position: new Vector2(300, 200), face: null},
//     {index: 1, position: new Vector2(260, 250), face: null},
//     {index: 2, position: new Vector2(260, 300), face: null},
// ]

// export const sites = [
//     {index: 0, position: new Vector2(320, 200), face: null},
//     {index: 1, position: new Vector2(200, 300), face: null},
//     {index: 2, position: new Vector2(400, 300), face: null},
//     {index: 3, position: new Vector2(299, 500), face: null},
// ]
//
// export const sites = [
//     {index: 0, position: new Vector2(250, 100), face: null},
//     {index: 1, position: new Vector2(200, 200), face: null},
//     {index: 2, position: new Vector2(300, 200), face: null},
//     {index: 3, position: new Vector2(400, 200), face: null},
//     {index: 4, position: new Vector2(300, 300), face: null},
// ]

export const sites = [...new Array(40)]
    .map((_, i) => i)
    .map(i => ({
            index: i, position: new Vector2(
                Math.random() * 600 + 100, Math.random() * 600 + 100
            ), face: null
        }
    ))

/*

worky
site event 0 52 190
site event 1 170 200
site event 2 300 211
circle event 2 1 0 81288.5 -957699.5
site event 3 150 330
circle event 0 1 3 105.77477477477477 256.65765765765764
circle event 3 1 2 229.06629672897196 275.6255841121495
DONE!


notworky
site event 0 51 190
site event 1 170 200
site event 2 300 211
site event 3 150 330
circle event 0 1 3 105.32450542437779 256.58838544990425
circle event 3 1 2 229.06629672897196 275.6255841121495
circle event 3 1 2 -18001.166666666668 215723.83333333334
DONE!



 */