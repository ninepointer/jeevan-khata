import { NextFunction } from "express";
import CatchAsync from "../middlewares/CatchAsync";
import TestName from "../models/LabTest"
import BioMarker from "../models/BioMarker";


export const ocrProccesing = async(ocrData: any) => {


  console.log("ocrData", ocrData.length)
  const testName = await TestName.find({isDeleted: false});
  const bioMarker = await BioMarker.find({isDeleted: false})
    //console.log("testName", (testName as any), (bioMarker as any).data)
    let ocrObj: any = {};
    
    //SORT THE OCR DATA BY Y COORDINATE- By default average of coordinates
    let fullText = ocrData[0].textAnnotations[0];
    // //console.log("fullText", fullText)
    // //console.log("ocrData[0].textAnnotations", ocrData[0].textAnnotations)
    let workingData = [... ocrData[0].textAnnotations];
    workingData.splice(0,1);  
    
    let sortedData = [...workingData]
    let dupData = [...workingData]
    
    
    sortedData.sort(function(a, b) {
        return averageCoord(a.boundingPoly, 'y') - averageCoord(b.boundingPoly, 'y'); 
    });
    
      
    // sortedData.map((elem)=>{console.log(elem.description, averageCoord(elem.boundingPoly, 'y'))});  
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
        //console.log("possibleArr", possibleArr)

        data = [];
        for(let i = 0; i<possibleArr.length; i++){
          if(fullText.description.toLowerCase().includes(possibleArr[i])){
              // //////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
               let dat = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === possibleArr[i].toLowerCase();    
              });
              //////console.log('dat is', dat);
              data.push(dat);
          }
      }
      
      console.log("data", data)
      if(data.length === 0 || Object.keys(data[0]).length === 0){
        return;
      }
      
      let yavg = averageCoord(data[0][0].boundingPoly,'y');
      let xavg = averageCoord(data[0][0].boundingPoly,'x');    
      //////console.log(yavg, xavg);
      
      
      let withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= y_coordGap
          );
      //////console.log('withiny',withinY);
      let withinXY = withinY.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'x') - xavg) <= x_coordGap
          );
      
          
      let allData = withinXY.map((obj)=> {if(obj.description.toLowerCase()!= data[0][0].description) return obj.description});
      ////console.log(allData);
      if(objName !== "lab"){
        allData.splice(allData.indexOf(data[0][0].description), 1);
      }
      ocrObj[objName] = allData.join(' ');
      
      // ////console.log(ocrObj);
      
      
      }
      
      
      function extractOcrDataBiomarker(possibleArr: string | any[], resultArr: any, unitsArr: any, rangesArr: any){
        //console.log("testName", testName, bioMarker)

        let testNameArr = testName.map((elem)=>{
          return (elem.testName).toLowerCase().split(" ").concat(elem.testScientificName.toLowerCase().split(" "))
        })



        //console.log("testNameArr", testNameArr)
        testNameArr.map((elem)=>{
          extractOcrData(elem, "testName", 150, 10)
        })

         
        let bioMarkerDataAdmin: string | any[] = [];
        for(let i = 0; i < testName.length; i++){
          if((testName[i].testName).toLowerCase().includes((ocrObj.testName).toLowerCase())){
            bioMarkerDataAdmin = testName[i].bioMarkers;
            break;
          }
        }

        let bioMarkerDataAdminArr: any = [];
        bioMarkerDataAdmin.map((elem: string)=>{
          //console.log("elem", elem)
          let matchedBioMarker: any = bioMarker.filter((subElem)=>{
            //console.log("subElem", subElem)
            return subElem.name === elem;
          })
          //console.log("matchedBioMarker", matchedBioMarker)
          let tempArr = matchedBioMarker[0].alias[0].split(",");
          tempArr.push((matchedBioMarker[0].name).toLowerCase())
          // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
          //console.log("tempArr", tempArr)
          bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)

        })

        //console.log("bioMarkerDataAdmin", bioMarkerDataAdminArr)

    
        data = [];
        for(let i = 0; i<resultArr.length; i++){
          if(fullText.description.toLowerCase().includes(resultArr[i])){
              // //////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
                let dat = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === resultArr[i].toLowerCase();    
              });
              //////console.log('dat is', dat);
              data.push(dat);
          }
        }
    
    
    
        let resultY = averageCoord(data[0][0].boundingPoly,'y');
    
    let withinResultY = sortedData.filter(obj =>
        Math.abs(averageCoord(obj.boundingPoly,'y') - resultY) <= 10
        );
    
    // //console.log(withinResultY); 
    
    let rangeX;
    for(let i = 0; i < rangesArr.length; i++){
      let range = withinResultY.filter((item)=>item.description.toLowerCase() ==  rangesArr[i]);
      // //console.log("range", range); 
      rangeX = averageCoord(range[0]?.boundingPoly,'x');
      if(range.length){
        break;
      }
    }

    
    
    // getting unit
    
    let unitX;
    for(let i = 0; i < unitsArr.length; i++){
      let unit = withinResultY.filter((item)=>item.description.toLowerCase() == unitsArr[i]);
      // ////console.log("range", range);
      unitX = averageCoord(unit[0]?.boundingPoly,'x');
      
      if(unit.length){
         break;
      }
    }
    
    
    ////console.log("unitX", unitX); 
    let resultX
    for(let i = 0; i < resultArr.length; i++){
      let result = withinResultY.filter((item)=>item.description.toLowerCase() == resultArr[i]);
      //////console.log("result", result); 'result' || observation
      
      resultX = averageCoord(result[0].boundingPoly,'x');
      if(result.length){
        break;
      }
    }
    
    
    
      
        data = [];
    
      for(let i=0;i<bioMarkerDataAdminArr.length; i++){
          if(fullText.description.toLowerCase().includes(((bioMarkerDataAdminArr[i] as any).toLowerCase()).trim()) || (bioMarkerDataAdminArr[i] as any).toLowerCase().trim().includes(fullText.description.toLowerCase())){
              let dat = sortedData.filter((data, index)=>{
                  return data.description.toLowerCase() === (bioMarkerDataAdminArr[i] as any).toLowerCase().trim()   
              });
              data.push(dat);
          }
      }
    
      const mapForRange = new Map();
      const mapForResult = new Map();
      const mapForUnit = new Map();
    
      for(let i = 0; i < data.length; i++){
    
        if(data[i][0]){
          let yavg = averageCoord(data[i][0].boundingPoly,'y');
        let xavg = averageCoord(data[i][0].boundingPoly,'x');     
    
        const withinY = sortedData.filter(obj =>
            Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
            );
    
        //////console.log(`within y for ${data[i][0].description}`,withinY);
    
    
        for(let j = 0; j<withinY.length; j++){
            // //////console.log(withinY.length);
            //console.log(rangeX, averageCoord(withinY[j].boundingPoly, 'x'), withinY[j].boundingPoly.vertices[1].x)
            //     , withinY[j].boundingPoly.vertices[2].x, withinY[j].boundingPoly.vertices[3].x));
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - (rangeX as any)) <= 50){
                    //console.log(`range for ${data[i][0].description} is ${withinY[j].description}`);

                    if(mapForRange.has(data[i][0].description)){
                      let rangeArr = mapForRange.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForRange.set(data[i][0].description, [withinY[j].description])
                    }
            }
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - (resultX as any)) <= 50){
                    // ////console.log(`result for ${data[i][0].description} is ${withinY[j].description}`);
                    if(mapForResult.has(data[i][0].description)){
                      let rangeArr = mapForResult.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForResult.set(data[i][0].description, [withinY[j].description])
                    }
           
           }  
            

            if(unitX && Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - unitX) <= 50){
              // ////console.log(`unit for ${data[i][0].description} is ${withinY[j].description}`);
              if(mapForUnit.has(data[i][0].description)){
                let rangeArr = mapForUnit.get(data[i][0].description);
                rangeArr.push(withinY[j].description)
              } else{
                mapForUnit.set(data[i][0].description, [withinY[j].description])
              }
            } 
        }
        // ////console.log('time in ms', performance.now()- time); unitX
    
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


      // approach 2

      function extractOcrDataBioMarkerNew(propertyName: string){
    
        let tempArr: any = [];
        let testNameArr = testName.map((elem)=>{
          tempArr.push((elem.testName).toLowerCase())
          return tempArr.concat(elem.testScientificName.toLowerCase().split(" "))
        })



        console.log("testNameArr", testNameArr)

        let bioMarkerDataAdmin: string | any[] = [];
        for(let i = 0; i < testNameArr.length; i++){
          for(let j = 0; j < testNameArr[i].length; j++){
            if(fullText.description.toLowerCase().includes(testNameArr[i][j].toLowerCase())){
              console.log(fullText.description.toLowerCase().indexOf("cbc"))
              testName.map((elem)=>{
                console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())

                if(elem.testName.toLowerCase() === testNameArr[i][j].toLowerCase() || elem.testScientificName.toLowerCase() === testNameArr[i][j].toLowerCase()){
                  console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())
                  bioMarkerDataAdmin = elem.bioMarkers
                }
                  
              })
              
            }
          }
        }
        

        // console.log("bioMarkerDataAdmin", bioMarkerDataAdmin)
        let bioMarkerDataAdminArr: any = [];
        bioMarkerDataAdmin.map((elem: string)=>{
          // //console.log("elem", elem)
          let matchedBioMarker: any = bioMarker.filter((subElem)=>{
            // //console.log("subElem", subElem)
            return subElem.name === elem;
          })
          //console.log("matchedBioMarker", matchedBioMarker)
          let tempArr = matchedBioMarker[0].alias[0].split(",");
          tempArr.push((matchedBioMarker[0].name).toLowerCase())
          // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
          // console.log("tempArr", tempArr)
          bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)

        })
        bioMarkerDataAdminArr = bioMarkerDataAdminArr.map((elem: string)=>{
          return elem.toLowerCase().trim();
        })
        bioMarkerDataAdminArr = [...new Set(bioMarkerDataAdminArr)]
        // console.log("bioMarkerDataAdmin", bioMarkerDataAdminArr)

 
function findElementsInSameLine(searchStrings: string[]): any[] {
  let result: any[] = [];

  for (const string of searchStrings) {
      for (const data of sortedData) {
          if (data.description.toLowerCase() === string) {
              let lineData: any[] = [];
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

const searchStrings: string[] = ['result', 'observation'];
const result = findElementsInSameLine(searchStrings);

console.log('result', result);

let rangeVals: string[] = ['range', 'ref', 'interval', 'biological', 'value', 'reference'];

function hasMatch(objectsArray: any[], searchStrings: string[]): boolean {
  for (const data of objectsArray) {
    if (searchStrings.includes(data.description.toLowerCase())) {
      return true;
    }
  }
  return false;
}
if (hasMatch(result, rangeVals)) console.log('Right line');

rangeVals = ['range', 'ref', 'interval', 'reference', 'biological'];
const resultVals: string[] = ['result', 'observation', 'value'];
const unitVals: string[] = ['units', 'unit'];

const findMatchedIndex = (arr: any[], searchArr: string[]): number[] => {
  const matchedIndex: number[] = [];
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
      
      interface Order {
        range?: any;
        result?: any;
        unit?: any;
      }
      
      const orderObj: Order = {} ;
      if(rangeMatches.length > 0){
        orderObj.range = parseInt(rangeMatches.join(), 10)
      }
      if(resultMatches.length > 0){
        orderObj.result = parseInt(resultMatches.join(), 10)
      }
      if(unitMatches.length > 0){
        orderObj.unit = parseInt(unitMatches.join(), 10)
      }
      
      console.log(orderObj);
      const sortedObj = Object.entries(orderObj).sort((a, b) => a[1] - b[1]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      console.log(sortedObj);
      let lineOrder = Object.keys(sortedObj);
      console.log(lineOrder);
      
      
      let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
      
      let data = [];
      
      for(let i=0;i<bioMarkerDataAdminArr.length; i++){
        if(fullText.description.toLowerCase().includes(bioMarkerDataAdminArr[i].toLowerCase().trim())){
          // //console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
          //Get the vertices of the match
          let dat = sortedData.filter((data, index)=>{
            return data.description.toLowerCase() === bioMarkerDataAdminArr[i].toLowerCase().trim()    
          });
          data.push(dat);
        }
      }
      

        let bioMarkerDataArr = [];
        
        for(let i = 0; i < data.length; i++){

          let bioMarkerDataObj: any = {};
          let innerObj: any = {};
          
          if(data[i][0]){
            let yavg = averageCoord(data[i][0].boundingPoly,'y');
            let xavg = averageCoord(data[i][0].boundingPoly,'x');     
            
            const withinY = sortedData.filter(obj =>
              Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
              );
            
              withinY.sort((a,b)=>{
                return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x')
              })
              // console.log(`within y for ${data[i][0].description}`,withinY);
              
              bioMarkerDataObj[data[i][0].description] = innerObj;
              let temp = '';
              let coord = [];
              let bioMarkersVal:any = {};
              let elemNum =0; 
              let isFirst = true;    
              for(let j = 0; j<withinY.length; j++){
              //   if (j === 0 && (withinY[1].description === '%' || withinY[1].description === '#')) {
              //     continue;
              // }
                 //console.log('coord.length', coord.length, 'elem', withinY[j].description);
                if(coord.length>0){
                  if(withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 5){
                    console.log(`${temp}` + `${withinY[j].description}`);
                    temp += withinY[j].description;
                    coord = withinY[j].boundingPoly.vertices;
                  }
                  else{
                    
                    if(!isFirst){
                      innerObj[lineOrder[elemNum]] = temp;
                      console.log(`${lineOrder[elemNum]}: ${temp}`);
                      temp = withinY[j].description;
                      coord = withinY[j].boundingPoly.vertices;

                      elemNum++;
                    } else{
                      temp = withinY[j].description;
                      coord = withinY[j].boundingPoly.vertices;
                      isFirst = false;
                    }
                    // innerObj[lineOrder[elemNum]] = temp;
                    // innerObj[]


                  }
                }else{
                  //console.log(`setting temp ${withinY[j].description}`);
                  // console.log(`checking for ${lineOrder[elemNum]}`);
                  temp = withinY[j].description;
                  coord = withinY[j].boundingPoly.vertices;
                }
              }
              innerObj[lineOrder[elemNum]] = temp;
              console.log(`${lineOrder[elemNum]}: ${temp}`);
              temp = '';
              coord = [];    

              // //console.log(bioMarkerDataObj.data[i][0].description, bioMarkerDataObj[data[i][0].description], )
              // if(bioMarkerDataObj.data[i][0].description.lineOrder[0]){
                bioMarkerDataArr.push(bioMarkerDataObj);
              // }
              
              
      }
        }  
        
        //console.log("bioMarkerDataArr", bioMarkerDataArr)
        ocrObj[propertyName] = bioMarkerDataArr;
      }
    
    
      let rangesArr = ['range'];
      let unitsArr = ['units']
      let resultArr = ['result', 'observation'];
      let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
      let labs = ['labs', 'labrotories', 'hospital', 'diagnostics', 'lab '];
      const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];
      const ageArr = ['age'];
      let genderArr = ['gender', 'sex'];
    
    
      extractOcrData(genderArr, "gender", 50, 10)
      extractOcrData(labs, "lab", 150, 10)
      extractOcrData(namesArr, "name", 150, 10)
      extractOcrData(ageArr, "age", 100, 10)
    
      // extractOcrDataBiomarker(bioMarkersArr, resultArr, unitsArr, rangesArr)

      extractOcrDataBioMarkerNew("bioMarker")
    
      console.log(ocrObj)
      console.log(ocrObj.bioMarker)

      return ocrObj
}
