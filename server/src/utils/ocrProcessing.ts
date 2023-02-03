import { NextFunction } from "express";
import CatchAsync from "../middlewares/CatchAsync";


export const ocrProccesing = async(ocrData: any) => {

    // console.log("ocrData", ocrData)
    let ocrObj: any = {};
    
    //SORT THE OCR DATA BY Y COORDINATE- By default average of coordinates
    let fullText = ocrData[0].textAnnotations[0];
    // console.log("fullText", fullText)
    // console.log("ocrData[0].textAnnotations", ocrData[0].textAnnotations)
    let workingData = [... ocrData[0].textAnnotations];
    workingData.splice(0,1);  
    
    let sortedData = [...workingData]
    let dupData = [...workingData]
    
    
    sortedData.sort(function(a, b) {
        return a.boundingPoly.vertices[0].y + a.boundingPoly.vertices[1].y + a.boundingPoly.vertices[2].y + a.boundingPoly.vertices[3].y  - b.boundingPoly.vertices[0].y+  b.boundingPoly.vertices[1].y+  b.boundingPoly.vertices[2].y+  b.boundingPoly.vertices[3].y;
      });
    //GET THE LAB NAME
    
    //Search for labs, diagnostics, Pvt. Ltd., Hospital, labrotory
    let time = performance.now(); 
    let data: any[][] = [];
    
    
    function averageCoord(boundingPoly: { vertices: any[]; }, xy: string){
        return (boundingPoly.vertices.map((item)=>item[xy]).reduce((total, currentValue)=> total+currentValue, 0)/boundingPoly.vertices.length);
    
    }
    
    //GET THE NAME, AGE, DATE FROM OCR DATA
    
    //1. Search for name, age, Date of report, Date of collection, doctor, gender,
    
    /*NAME*/
    //Pt.name, name, Patient
    
    //If no name, find first name and last name fields, get their values and add them 
    
    //Get rid of Mr., Mrs., Ms., Dr. and other titles
    
    //Add the key name and the value to the ocrObj
    
    
    /*AGE*/
    
    
    //a. Sometimes age is in years and months, sometimes in weeks
    //Take the age with standard unit of years. If yrs, store it as years. If years and months, store it as years. If weeks, store as weeks.
    
    //b. Sometimes age and sex are batched together like Age/Sex
    
    // split the age/sex value by '/' and take the first as age and second element as sex, apply the same rules as for age under a. if applicable
    
    /*GENDER*/
    //Gender, sex, 
    
    
    //If the ocrObj has gender, proceed to the next step
    
    //If gender is F or M, convert it to Male and Female, store it in ocrObj
    
    
    
    /*REFERRING DOCTOR*/
    
    //Referring dr., Referring doctor, Doctor, Dr., Referred by,
    
    //Store doctor's name.
    
    
    /*DATE OF REPORT AND DATE OF COLLECTION*/
    
    //Report Date
    
    
    
    //GET TEST NAME
    
    //1. Get the bio markers from the test name
    
    
    
    //2. Search for the biomarkers in the OCR Data
    
    //3. Get the coordinates of the biomarker name
    
    
      function extractOcrData(possibleArr: string | any[], objName: string, x_coordGap: number, y_coordGap: number){
    
        data = [];
        for(let i = 0; i<possibleArr.length; i++){
          if(fullText.description.toLowerCase().includes(possibleArr[i])){
              // ////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
               let dat = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === possibleArr[i].toLowerCase();    
              });
              ////console.log('dat is', dat);
              data.push(dat);
          }
      }
      
      ////console.log(data);
      
      
      let yavg = averageCoord(data[0][0].boundingPoly,'y');
      let xavg = averageCoord(data[0][0].boundingPoly,'x');    
      ////console.log(yavg, xavg);
      
      
      let withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= y_coordGap
          );
      ////console.log('withiny',withinY);
      let withinXY = withinY.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'x') - xavg) <= x_coordGap
          );
      
          
      let allData = withinXY.map((obj)=> {if(obj.description.toLowerCase()!= data[0][0].description) return obj.description});
      //console.log(allData);
      if(objName !== "lab"){
        allData.splice(allData.indexOf(data[0][0].description), 1);
      }
      ocrObj[objName] = allData.join(' ');
      
      // //console.log(ocrObj);
      
      
      }
      
      
      function extractOcrDataBiomarker(possibleArr: string | any[], resultArr: string | any[]){
    
        data = [];
        
        for(let i = 0; i<resultArr.length; i++){
          if(fullText.description.toLowerCase().includes(resultArr[i])){
              // ////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
                let dat = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === resultArr[i].toLowerCase();    
              });
              ////console.log('dat is', dat);
              data.push(dat);
          }
        }
    
    
    
        let resultY = averageCoord(data[0][0].boundingPoly,'y');
    
    let withinResultY = sortedData.filter(obj =>
        Math.abs(averageCoord(obj.boundingPoly,'y') - resultY) <= 10
        );
    
    console.log(withinResultY); 
    
    let range = withinResultY.filter((item)=>item.description.toLowerCase() ==  ('ref'));
    console.log("range", range); 
    // if(range){ 'range' || 'interval' || 
        let rangeX = averageCoord(range[0].boundingPoly,'x');
    // }
    
    
    // getting unit
    
    let unit = withinResultY.filter((item)=>item.description.toLowerCase() == 'units');
    // //console.log("range", range);
    
    let unitX;
    if(unit.length){
        unitX = averageCoord(unit[0].boundingPoly,'x');
    }
    
    
    //console.log("unitX", unitX); 
    
    let result = withinResultY.filter((item)=>item.description.toLowerCase() == 'observation');
    ////console.log("result", result); 'result' || 
    
    let resultX = averageCoord(result[0].boundingPoly,'x');
    
    
    
      
        data = [];
    
      for(let i=0;i<possibleArr.length; i++){
          if(fullText.description.toLowerCase().includes(possibleArr[i].toLowerCase())){
              // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
              //Get the vertices of the match
              let dat = sortedData.filter((data, index)=>{
                  return data.description.toLowerCase() === possibleArr[i].toLowerCase()    
              });
              data.push(dat);
          }
      }
    
      const mapForRange = new Map();
      const mapForResult = new Map();
      const mapForUnit = new Map();
    

    //Looping through all the biomarkers that were found in the ocr  
      for(let i = 0; i < data.length; i++){
    
        if(data[i][0]){
          let yavg = averageCoord(data[i][0].boundingPoly,'y');
        let xavg = averageCoord(data[i][0].boundingPoly,'x');     
        //Finding the same line elements for each biomarker
        const withinY = sortedData.filter(obj =>
            Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
            );
            
        ////console.log(`within y for ${data[i][0].description}`,withinY);
    
      //Looping through all the same line elements of a biomarker 
        for(let j = 0; j<withinY.length; j++){
            // ////console.log(withinY.length);
            // console.log(rangeX, averageCoord(withinY[j].boundingPoly, 'x'), withinY[j].boundingPoly.vertices[1].x)
            //     , withinY[j].boundingPoly.vertices[2].x, withinY[j].boundingPoly.vertices[3].x));
            
            //APPROACH 1. ADD ITEMS BELOW RANGE, RESULT, UNIT

            //Checking if the  line element is below the 'range'
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - rangeX) <= 50){
                    console.log(`range for ${data[i][0].description} is ${withinY[j].description}`);

                    //pushing the data into the range field of the biomarker object.
                    if(mapForRange.has(data[i][0].description)){
                      let rangeArr = mapForRange.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForRange.set(data[i][0].description, [withinY[j].description])
                    }
            }
            //Checking if the  line element is below the 'result'
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - resultX) <= 50){
                    // //console.log(`result for ${data[i][0].description} is ${withinY[j].description}`);
                    if(mapForResult.has(data[i][0].description)){
                      let rangeArr = mapForResult.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForResult.set(data[i][0].description, [withinY[j].description])
                    }
           
           }  
            
           //Checking if the  line element is below the 'unit'
            if(unitX && Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - unitX) <= 50){
              // //console.log(`unit for ${data[i][0].description} is ${withinY[j].description}`);
              if(mapForUnit.has(data[i][0].description)){
                let rangeArr = mapForUnit.get(data[i][0].description);
                rangeArr.push(withinY[j].description)
              } else{
                mapForUnit.set(data[i][0].description, [withinY[j].description])
              }
            }
            
            
            
            
            
          }
          // //console.log('time in ms', performance.now()- time); unitX
          
        }
        
      }
      
      // Creating array of object from map's for biomarkers
      let bioMarkerDetailArr: any = [];
      
      for (let key of mapForRange.keys()){
        let bioMarkerDetailObj: any = {};
        let obj: any = {};
        bioMarkerDetailObj[key] = obj;
        if(mapForRange.has(key)){
          // removing duplicate value and storing
          obj.range = [...new Set(mapForRange.get(key))].join(" ");
        }
        if(mapForResult.has(key)){
          obj.result = [...new Set(mapForResult.get(key))].join(" ");
        }
        if(mapForUnit.has(key)){
          obj.unit = [...new Set(mapForUnit.get(key))].join("");
        }
        bioMarkerDetailArr.push(JSON.parse(JSON.stringify(bioMarkerDetailObj)));
      }
      
      
      ocrObj.bioMarker = bioMarkerDetailArr
      
      
    }
    //APPROACH 2. ADD ITEMS TO BIOMARKER OBJECT IN THE ORDER THE HEADER LINE IS
    function extractOcrDataBioMarkerNew(possibleArr: string | any[], resultArr: string | any[]){
    
      function findElementsInSameLine(searchStrings: string[]): any {
        let result = {};
    
        for (const string of searchStrings) {
            for (const data of sortedData) {
                if (data.description.toLowerCase() === string) {
                    let lineData = [];
                    const y = averageCoord(data.boundingPoly, 'y');
                    for (const d of sortedData) {
                        if ( Math.abs(averageCoord(d.boundingPoly, 'y') - y) <= 10) {
                            lineData.push(d);
                        }
                    }
                    result = lineData.sort((a, b) => a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x);
                }
            }
        }
    
        return result;
    }
    
    const searchStrings: string[] = ['result', 'observation', 'value'];
    const result = findElementsInSameLine(searchStrings);
    
    console.log('result', result);
    
    let rangeVals: string[] = ['range', 'ref', 'interval', 'biological'];
    
    function hasMatch(objectsArray: any[], searchStrings: string[]): boolean {
      for (let i = 0; i < objectsArray.length; i++) {
        if (searchStrings.includes(objectsArray[i].description.toLowerCase())) {
          return true;
        }
      }
      return false;
    }
    if(hasMatch(result, rangeVals))console.log('Right line');
    
    
    rangeVals = ['range', 'ref', 'interval', 'biological'];
    const resultVals: string[] = ['result', 'observation', 'value'];
    const unitVals: string[] = ['units', 'unit'];
    
    const findMatchedIndex = (arr: any[], searchArr: string[]): number[] => {
      let matchedIndex = [];
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
    
    console.log("Range matches:", rangeMatches.join());
    console.log("Result matches:", resultMatches.join());
    console.log("Unit matches:", unitMatches.join());
    
    let orderObj = {range: parseInt(rangeMatches.join()), result: parseInt(resultMatches.join()), unit: parseInt(unitMatches.join())};
    
    
    console.log(orderObj);
    const sortedObj:any = Object.entries(orderObj).sort((a, b) => a[1] - b[1]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    console.log(sortedObj);
    let lineOrder = Object.keys(sortedObj).sort((a, b) => sortedObj[a] - sortedObj[b]);
    console.log(lineOrder);
    
    
    let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
    
    let data = [];
    
    for(let i=0;i<bioMarkersArr.length; i++){
      if(fullText.description.toLowerCase().includes(bioMarkersArr[i].toLowerCase())){
        // console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
        //Get the vertices of the match
        let dat = sortedData.filter((data, index)=>{
          return data.description.toLowerCase() === bioMarkersArr[i].toLowerCase()    
        });
        data.push(dat);
      }
    }
    
    
    for(let i = 0; i < data.length; i++){
      
      if(data[i][0]){
        let yavg = averageCoord(data[i][0].boundingPoly,'y');
        let xavg = averageCoord(data[i][0].boundingPoly,'x');     
        
        const withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
          );
          
          console.log(`within y for ${data[i][0].description}`,withinY);
          
          let temp = '';
          let coord = [];
          let bioMarkersVal:any = {};
          let elemNum =0;     
          for(let j = 1; j<withinY.length; j++){
            if(withinY[1].description == '%' ||withinY[j].description == '#') continue;
            console.log('coord.length', coord.length, 'elem', withinY[j].description);
            if(coord.length>0){
              if(withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 5){
                // console.log(`${temp}` + `${withinY[j].description}`);
                temp += withinY[j].description;
                coord = withinY[j].boundingPoly.vertices;
              }
              else{
                bioMarkersVal[lineOrder[elemNum]] = temp;
                console.log(`${lineOrder[elemNum]}: ${temp}`);
                temp = withinY[j].description;
                coord = withinY[j].boundingPoly.vertices;
                ++elemNum;
              }
            }else{
              console.log(`setting temp ${withinY[j].description}`);
              console.log(`checking for ${lineOrder[elemNum]}`);
              temp = withinY[j].description;
              coord = withinY[j].boundingPoly.vertices;
            }
          }
          bioMarkersVal[lineOrder[elemNum]] = temp;
          console.log(`${lineOrder[elemNum]}: ${temp}`);
          temp = '';
          coord = [];    
          
  }
}          
}
let resultArr = ['result', 'observation'];
let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
let labs = ['labs', 'labrotories', 'hospital', 'diagnostics', 'lab '];
const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];
const ageArr = ['age'];
let genderArr = ['gender', 'sex'];


//   extractOcrData(genderArr, "gender", 50, 10)
extractOcrData(labs, "lab", 150, 10)
extractOcrData(namesArr, "name", 150, 10)
//   extractOcrData(ageArr, "age", 100, 10)

extractOcrDataBiomarker(bioMarkersArr, resultArr)

console.log(ocrObj)
console.log(ocrObj.bioMarker)

return ocrObj
}