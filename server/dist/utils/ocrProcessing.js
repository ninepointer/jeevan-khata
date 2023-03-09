"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrProccesing = void 0;
// import CatchAsync from "../middlewares/CatchAsync";
const LabTest_1 = __importDefault(require("../models/LabTest"));
const BioMarker_1 = __importDefault(require("../models/BioMarker"));
// import tempOcrData from "./tempOcrData"
const ocrProccesing = (ocrData) => __awaiter(void 0, void 0, void 0, function* () {
    //CONFIRMING THE RESPONSE FROM GOOGLE OCR HAS SOME DATA
    // //console.log("ocrData", ocrData.length)
    // console.log(ocrData);
    if (!ocrData.length)
        return;
    //FIND ALL THE TESTS FROM DB
    const testName = yield LabTest_1.default.find({ isDeleted: false });
    //FIND ALL BIO MARKERS
    //TODO: FOR @Vijay; We only need the biomarkers after the test name matches. 
    const bioMarker = yield BioMarker_1.default.find({ isDeleted: false });
    let ocrObj = {};
    //Get the full text from Ocr data
    let fullText = ocrData[0].textAnnotations[0];
    //Get the working data from Ocr data
    let workingData = [...ocrData[0].textAnnotations];
    workingData.splice(0, 1);
    //FUNCTION TO GET THE AVERAGE COORDINATES
    function averageCoord(boundingPoly, xy) {
        return (boundingPoly.vertices.map((item) => item[xy]).reduce((total, currentValue) => total + currentValue, 0) / boundingPoly.vertices.length);
    }
    //Sort the data by the average of Y coordinate
    let sortedData = [...workingData];
    sortedData.sort(function (a, b) {
        return averageCoord(a.boundingPoly, 'y') - averageCoord(b.boundingPoly, 'y');
    });
    // sortedData.map((elem)=>{//console.log(elem.description, averageCoord(elem.boundingPoly, 'y'))});  
    //STRICTLY FOR MONITORING PERFORMANCE
    let time = performance.now();
    let matches = [];
    //Function to extract Data and add it to final Object
    function extractOcrData(possibleArr, objName, x_coordGap, y_coordGap) {
        ////console.log("possibleArr", possibleArr)
        matches = [];
        //Look for matches from possible values for field in sorted data and add to to matches 
        for (let i = 0; i < possibleArr.length; i++) {
            if (fullText.description.toLowerCase().includes(possibleArr[i])) {
                // ////////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
                //Get the vertices of the match
                let match = sortedData.filter((item) => {
                    return item.description.toLowerCase() === possibleArr[i].toLowerCase();
                });
                ////////console.log('dat is', dat);
                matches.push(match);
            }
        }
        //console.log("matches", matches);
        //If there are no matches, return from the execution of function
        if (matches.length === 0 || Object.keys(matches[0]).length === 0) {
            return;
        }
        let yavg = averageCoord(matches[0][0].boundingPoly, 'y');
        let xavg = averageCoord(matches[0][0].boundingPoly, 'x');
        ////////console.log(yavg, xavg);
        //Getting the elements in the same line of the match
        let withinY = sortedData.filter(obj => Math.abs(averageCoord(obj.boundingPoly, 'y') - yavg) <= y_coordGap && obj.description !== ":" && obj.description.toLowerCase() !== "mr." && obj.description.toLowerCase() !== "mrs." && obj.description.toLowerCase() !== "ms.");
        withinY.sort(function (a, b) {
            return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
        });
        console.log('withiny', withinY);
        //Getting the elements that is in proximity to the same line item match
        let withinXY = withinY.filter((obj) => (averageCoord(obj.boundingPoly, 'x') - xavg) <= x_coordGap && (averageCoord(obj.boundingPoly, 'x') >= xavg));
        //Get the adjacent elements and adding it to the object property as a string    
        let allData = withinXY.map((obj) => { if (obj.description.toLowerCase() != matches[0][0].description)
            return obj.description; });
        //////console.log(allData);
        if (objName !== "lab") {
            allData.splice(allData.indexOf(matches[0][0].description), 1);
        }
        ocrObj[objName] = allData.join(' ');
        // //////console.log(ocrObj);
    }
    //Function for extracting all biomarkers from Ocr data for the test
    // approach 2
    function extractOcrDataBioMarkerNew(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            //creating an array with all the possible test names that could appear in the document
            let tempArr = [];
            let testNameArr = testName.map((elem) => {
                tempArr.push((elem.testName).toLowerCase());
                return tempArr.concat(elem.testScientificName.toLowerCase().split(" "));
            });
            // //console.log("testNameArr", testNameArr)
            //Finding matches for the test name in our document from the possible list of test names and then storing their biomarkers in an array
            let bioMarkerDataAdmin = [];
            for (let i = 0; i < testNameArr.length; i++) {
                for (let j = 0; j < testNameArr[i].length; j++) {
                    if (fullText.description.toLowerCase().includes(testNameArr[i][j].toLowerCase())) {
                        testName.map((elem) => {
                            // //console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())
                            if (elem.testName.toLowerCase() === testNameArr[i][j].toLowerCase() || elem.testScientificName.toLowerCase() === testNameArr[i][j].toLowerCase()) {
                                // //console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())
                                bioMarkerDataAdmin = elem.bioMarkers;
                            }
                        });
                    }
                }
            }
            const filter = {
                name: { $in: bioMarkerDataAdmin },
                isDeleted: false
            };
            const bioMarker = yield BioMarker_1.default.find(filter);
            // const result = await collection.find(filter).toArray(); .toArray();
            // //console.log("matchedBioMarker", matchedBioMarker)
            // //console.log("bioMarkerDataAdmin", bioMarkerDataAdmin)
            let bioMarkerDataAdminArr = [];
            let mappingObjArr = [];
            let mappingObj = {};
            bioMarkerDataAdmin.map((elem) => {
                // ////console.log("elem", elem)
                let matchedBioMarker = bioMarker.filter((subElem) => {
                    // ////console.log("subElem", subElem)
                    return subElem.name === elem;
                });
                mappingObj[matchedBioMarker[0].name] = matchedBioMarker[0].name;
                let tempArr = matchedBioMarker[0].alias[0].split(",");
                tempArr.map((element) => {
                    mappingObj[element.trim()] = matchedBioMarker[0].name;
                });
                tempArr.push((matchedBioMarker[0].name).toLowerCase());
                // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
                // //console.log("tempArr", tempArr)
                bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr);
            });
            bioMarkerDataAdminArr = bioMarkerDataAdminArr.map((elem) => {
                return elem.toLowerCase().trim();
            });
            bioMarkerDataAdminArr = [...new Set(bioMarkerDataAdminArr)];
            //console.log("mappingObj", mappingObj)
            //function for finding elements in the same line        
            function findElementsInSameLine(searchStrings) {
                let result = [];
                for (const string of searchStrings) {
                    for (const data of sortedData) {
                        if (data.description.toLowerCase() === string) {
                            let lineData = [];
                            const y = averageCoord(data.boundingPoly, 'y');
                            for (const d of sortedData) {
                                if (Math.abs(averageCoord(d.boundingPoly, 'y') - y) <= 10) {
                                    lineData.push(d);
                                }
                            }
                            result = lineData.sort((a, b) => a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x);
                        }
                    }
                }
                return result;
            }
            //Finding the results, units, range line
            const searchStrings = ['result', 'observation', 'observed'];
            const result = findElementsInSameLine(searchStrings);
            //console.log('result', result);
            let rangeVals = ['range', 'ref', 'interval', 'biological', 'value', 'reference', 'normal values'];
            //function for checking if the matched line contains other expected elements
            function hasMatch(objectsArray, searchStrings) {
                for (const data of objectsArray) {
                    if (searchStrings.includes(data.description.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            }
            //Double checking if we're in the right line
            if (hasMatch(result, rangeVals)) //console.log('Right line');
                rangeVals = ['range', 'ref', 'interval', 'reference', 'biological', 'normal values'];
            const resultVals = ['result', 'observation', 'value', 'observed'];
            const unitVals = ['units', 'unit'];
            const findMatchedIndex = (arr, searchArr) => {
                const matchedIndex = [];
                for (let i = 0; i < arr.length; i++) {
                    if (searchArr.includes(arr[i].description.toLowerCase())) {
                        matchedIndex.push(i);
                    }
                }
                return matchedIndex;
            };
            const rangeMatches = findMatchedIndex(result, rangeVals);
            const resultMatches = findMatchedIndex(result, resultVals);
            const unitMatches = findMatchedIndex(result, unitVals);
            const orderObj = {};
            if (rangeMatches.length > 0) {
                orderObj.range = parseInt(rangeMatches.join(), 10);
            }
            if (resultMatches.length > 0) {
                orderObj.result = parseInt(resultMatches.join(), 10);
            }
            if (unitMatches.length > 0) {
                orderObj.unit = parseInt(unitMatches.join(), 10);
            }
            //console.log(orderObj);
            const sortedObj = Object.entries(orderObj).sort((a, b) => a[1] - b[1]).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
            //console.log(sortedObj);
            let lineOrder = Object.keys(sortedObj);
            //console.log(lineOrder);
            //Here we have the order in which the results, units, range appear in our document 
            //Matching all the ocuurences of BioMarkers in Ocr Document 
            let matches = [];
            for (let i = 0; i < bioMarkerDataAdminArr.length; i++) {
                if (fullText.description.toLowerCase().includes(bioMarkerDataAdminArr[i].toLowerCase().trim())) {
                    // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
                    //Get the vertices of the match
                    let match = sortedData.filter((data, index) => {
                        return data.description.toLowerCase() === bioMarkerDataAdminArr[i].toLowerCase().trim();
                    });
                    matches.push(match);
                }
            }
            let bioMarkerDataArr = [];
            for (let i = 0; i < matches.length; i++) {
                let bioMarkerDataObj = {};
                let innerObj = {};
                if (matches[i][0]) {
                    let yavg = averageCoord(matches[i][0].boundingPoly, 'y');
                    let xavg = averageCoord(matches[i][0].boundingPoly, 'x');
                    const withinY = sortedData.filter(obj => Math.abs(averageCoord(obj.boundingPoly, 'y') - yavg) <= 10);
                    withinY.sort((a, b) => {
                        return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
                    });
                    // //console.log(`within y for ${data[i][0].description}`,withinY);
                    if (mappingObj[matches[i][0].description]) {
                        bioMarkerDataObj[mappingObj[matches[i][0].description]] = innerObj;
                    }
                    else {
                        bioMarkerDataObj[matches[i][0].description] = innerObj;
                    }
                    let temp = '';
                    let coord = [];
                    let bioMarkersVal = {};
                    let elemNum = 0;
                    let isFirst = true;
                    for (let j = 0; j < withinY.length; j++) {
                        //   if (j === 0 && (withinY[1].description === '%' || withinY[1].description === '#')) {
                        //     continue;
                        // }
                        ////console.log('coord.length', coord.length, 'elem', withinY[j].description);
                        if (coord.length > 0) {
                            if (withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 5) {
                                //console.log(`${temp}` + `${withinY[j].description}`);
                                temp += withinY[j].description;
                                coord = withinY[j].boundingPoly.vertices;
                            }
                            else {
                                if (!isFirst) {
                                    innerObj[lineOrder[elemNum]] = temp;
                                    //console.log(`${lineOrder[elemNum]}: ${temp}`);
                                    temp = withinY[j].description;
                                    coord = withinY[j].boundingPoly.vertices;
                                    elemNum++;
                                }
                                else {
                                    temp = withinY[j].description;
                                    coord = withinY[j].boundingPoly.vertices;
                                    isFirst = false;
                                }
                                // innerObj[lineOrder[elemNum]] = temp;
                                // innerObj[]
                            }
                        }
                        else {
                            ////console.log(`setting temp ${withinY[j].description}`);
                            // //console.log(`checking for ${lineOrder[elemNum]}`);
                            temp = withinY[j].description;
                            coord = withinY[j].boundingPoly.vertices;
                        }
                    }
                    innerObj[lineOrder[elemNum]] = temp;
                    //console.log(`${lineOrder[elemNum]}: ${temp}`);
                    temp = '';
                    coord = [];
                    // ////console.log(bioMarkerDataObj.data[i][0].description, bioMarkerDataObj[data[i][0].description], )
                    // if(bioMarkerDataObj.data[i][0].description.lineOrder[0]){
                    bioMarkerDataArr.push(bioMarkerDataObj);
                    // }
                }
            }
            // //console.log("bioMarkerDataArr", bioMarkerDataArr)
            ocrObj[propertyName] = bioMarkerDataArr;
            // //console.log("ocrObj", ocrObj)
        });
    }
    function extractHospitalName(propertyName, Arr) {
        return __awaiter(this, void 0, void 0, function* () {
            //function for checking if the matched line contains other expected elements
            let matches = [];
            // const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];
            for (let i = 0; i < Arr.length; i++) {
                if (fullText.description.toLowerCase().includes(Arr[i].toLowerCase().trim())) {
                    // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
                    //Get the vertices of the match
                    let match = sortedData.filter((data, index) => {
                        return data.description.toLowerCase() === Arr[i].toLowerCase().trim();
                    });
                    matches.push(match);
                }
            }
            console.log("matches", matches);
            console.log(matches.length);
            for (let i = 0; i < matches.length; i++) {
                if (matches[i][0]) {
                    let yavg = averageCoord(matches[i][0].boundingPoly, 'y');
                    let xavg = averageCoord(matches[i][0].boundingPoly, 'x');
                    let withinY = sortedData.filter(obj => 
                    // Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10 
                    Math.abs(averageCoord(obj.boundingPoly, 'y') - yavg) <= 10);
                    withinY.sort(function (a, b) {
                        return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
                    });
                    console.log(`within y for ${matches[i][0]}`, withinY);
                    let temp = '';
                    let coord = [];
                    let isFirst = true;
                    for (let j = 0; j < withinY.length; j++) {
                        ////console.log('coord.length', coord.length, 'elem', withinY[j].description);
                        temp += ` ${withinY[j].description}`;
                    }
                    ocrObj[propertyName] = temp.trim();
                    // //console.log(`${lineOrder[elemNum]}: ${temp}`);
                    temp = '';
                    coord = [];
                }
            }
            // //console.log("bioMarkerDataArr", bioMarkerDataArr)
            // ocrObj[propertyName] = bioMarkerDataArr;
            console.log("ocrObj for diffrent properties", ocrObj);
        });
    }
    function extractOcrDataNew(propertyName, Arr) {
        return __awaiter(this, void 0, void 0, function* () {
            //function for checking if the matched line contains other expected elements
            let matches = [];
            // const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];
            for (let i = 0; i < Arr.length; i++) {
                if (fullText.description.toLowerCase().includes(Arr[i].toLowerCase().trim())) {
                    // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
                    //Get the vertices of the match
                    let match = sortedData.filter((data, index) => {
                        return data.description.toLowerCase() === Arr[i].toLowerCase().trim();
                    });
                    matches.push(match);
                }
            }
            console.log("matches", matches);
            console.log(matches.length);
            for (let i = 0; i < matches.length; i++) {
                if (matches[i][0]) {
                    let yavg = averageCoord(matches[i][0].boundingPoly, 'y');
                    let xavg = averageCoord(matches[i][0].boundingPoly, 'x');
                    let withinY = sortedData.filter(obj => 
                    // Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10 
                    Math.abs(averageCoord(obj.boundingPoly, 'y') - yavg) <= 10 && averageCoord(obj.boundingPoly, 'x') >= xavg && obj.description !== ":" && obj.description.toLowerCase() !== "mr." && obj.description.toLowerCase() !== "mrs." && obj.description.toLowerCase() !== "ms.");
                    withinY.sort(function (a, b) {
                        return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
                    });
                    console.log(`within y for ${matches[i][0]}`, withinY);
                    let temp = '';
                    let coord = [];
                    let isFirst = true;
                    for (let j = 0; j < withinY.length; j++) {
                        ////console.log('coord.length', coord.length, 'elem', withinY[j].description);
                        if (coord.length > 0) {
                            if (withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 8) {
                                console.log(`${temp}` + `${withinY[j].description}`);
                                temp += ` ${withinY[j].description}`;
                                coord = withinY[j].boundingPoly.vertices;
                            }
                            else {
                                if (!isFirst) {
                                    // innerObj[lineOrder[elemNum]] = temp;
                                    console.log(`this is temp: ${temp}`);
                                    ocrObj[propertyName] = temp.trim();
                                    temp = ` ${withinY[j].description}`;
                                    coord = withinY[j].boundingPoly.vertices;
                                    return;
                                    // elemNum++;
                                }
                                else {
                                    temp = ` ${withinY[j].description}`;
                                    console.log(`this is temp in else: ${temp}`);
                                    ocrObj[propertyName] = temp.trim();
                                    coord = withinY[j].boundingPoly.vertices;
                                    isFirst = false;
                                }
                            }
                        }
                        else {
                            ////console.log(`setting temp ${withinY[j].description}`);
                            // //console.log(`checking for ${lineOrder[elemNum]}`);
                            temp = withinY[j].description;
                            coord = withinY[j].boundingPoly.vertices;
                        }
                    }
                    // //console.log(`${lineOrder[elemNum]}: ${temp}`);
                    temp = '';
                    coord = [];
                }
            }
            // //console.log("bioMarkerDataArr", bioMarkerDataArr)
            // ocrObj[propertyName] = bioMarkerDataArr;
            console.log("ocrObj for diffrent properties", ocrObj);
        });
    }
    let rangesArr = ['range'];
    let unitsArr = ['units'];
    let resultArr = ['result', 'observation'];
    let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"];
    let labs = ['labs', 'labrotories', 'hospital', 'diagnostics', 'lab'];
    const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient'];
    const ageArr = ['age'];
    let genderArr = ['gender', 'sex'];
    let datesArr = ['date of report', 'date', 'reporting date', 'report date', 'reported'];
    extractOcrData(genderArr, "gender", 50, 10);
    // extractOcrData(labs, "lab", 150, 10)
    // extractOcrData(namesArr, "name", 150, 10)
    extractOcrData(ageArr, "age", 100, 10);
    // extractOcrData(datesArr, 'date' ,100, 10);
    yield extractOcrDataNew("name", namesArr);
    yield extractOcrDataNew("date", datesArr);
    yield extractHospitalName("lab", labs);
    yield extractOcrDataBioMarkerNew("bioMarker");
    console.log(ocrObj);
    // //console.log(ocrObj.bioMarker)
    //console.log('Time Elapsed:', performance.now()-time);
    return ocrObj;
});
exports.ocrProccesing = ocrProccesing;
