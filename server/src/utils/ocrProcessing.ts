import { NextFunction } from "express";
import CatchAsync from "../middlewares/CatchAsync";
import TestName from "../models/LabTest"
import BioMarker from "../models/BioMarker";
import { Data } from "aws-sdk/clients/firehose";
import tempOcrData from "./tempOcrData"


export const ocrProccesing = async(ocrData: any) => {

  //CONFIRMING THE RESPONSE FROM GOOGLE OCR HAS SOME DATA
  // console.log("ocrData", ocrData.length)
  console.log(ocrData);
  if(!ocrData.length) return;

  //FIND ALL THE TESTS FROM DB
  const testName = await TestName.find({isDeleted: false});

  //FIND ALL BIO MARKERS
  //TODO: FOR @Vijay; We only need the biomarkers after the test name matches. 
  const bioMarker = await BioMarker.find({isDeleted: false});
    //console.log("testName", (testName as any), (bioMarker as any).data)
    let ocrObj: any = {};
    
    //SORT THE OCR DATA BY Y COORDINATE- By default average of coordinates

    //Get the full text from Ocr data
    let fullText = ocrData[0].textAnnotations[0];
    // //console.log("fullText", fullText)
    // //console.log("ocrData[0].textAnnotations", ocrData[0].textAnnotations)
    //Get the working data from Ocr data
    let workingData = [... ocrData[0].textAnnotations];
    workingData.splice(0,1);  
    
    //FUNCTION TO GET THE AVERAGE COORDINATE
    function averageCoord(boundingPoly: { vertices: any[]; }, xy: string){
        return (boundingPoly.vertices.map((item)=>item[xy]).reduce((total, currentValue)=> total+currentValue, 0)/boundingPoly.vertices.length);
    
    }
    //Sort the data by the average of Y coordinate
    let sortedData = [...workingData]
  
    sortedData.sort(function(a, b) {
        return averageCoord(a.boundingPoly, 'y') - averageCoord(b.boundingPoly, 'y'); 
    });
    
      
    // sortedData.map((elem)=>{console.log(elem.description, averageCoord(elem.boundingPoly, 'y'))});  
    
    //STRICTLY FOR MONITORING PERFORMANCE
    let time = performance.now(); 

    let matches: any[][] = [];
    
    //Function to extract Data and add it to final Object

      function extractOcrData(possibleArr: string | any[], objName: string, x_coordGap: number, y_coordGap: number){
        //console.log("possibleArr", possibleArr)

        matches = [];
        //Look for matches from possible values for field in sorted data and add to to matches 
        for(let i = 0; i<possibleArr.length; i++){
          if(fullText.description.toLowerCase().includes(possibleArr[i])){
              // //////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
               let match = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === possibleArr[i].toLowerCase();    
              });
              //////console.log('dat is', dat);
              matches.push(match);
          }
      }
      
      console.log("matches", matches);
      
      //If there are no matches, return from the execution of function
      if(matches.length === 0 || Object.keys(matches[0]).length === 0){
        return;
      }
      
      let yavg = averageCoord(matches[0][0].boundingPoly,'y');
      let xavg = averageCoord(matches[0][0].boundingPoly,'x');    
      //////console.log(yavg, xavg);
      
      //Getting the elements in the same line of the match
      let withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= y_coordGap
          );
      //////console.log('withiny',withinY);
      //Getting the elements that is in proximity to the same line item match
      let withinXY = withinY.filter(obj =>
            (averageCoord(obj.boundingPoly,'x') - xavg) <= x_coordGap && (averageCoord(obj.boundingPoly,'x') > xavg) 
          );
      
      //Get the adjacent elements and adding it to the object property as a string    
      let allData = withinXY.map((obj)=> {if(obj.description.toLowerCase()!= matches[0][0].description) return obj.description});
      ////console.log(allData);
      if(objName !== "lab"){
        allData.splice(allData.indexOf(matches[0][0].description), 1);
      }
      ocrObj[objName] = allData.join(' ');
      
      // ////console.log(ocrObj);
      
      
      }
      
      //DEPRECATED ---------------
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

    
        matches = [];
        for(let i = 0; i<resultArr.length; i++){
          if(fullText.description.toLowerCase().includes(resultArr[i])){
              // //////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
                let dat = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === resultArr[i].toLowerCase();    
              });
              //////console.log('dat is', dat);
              matches.push(dat);
          }
        }
    
    
    
        let resultY = averageCoord(matches[0][0].boundingPoly,'y');
    
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
    
    
    
      
        matches = [];
    
      for(let i=0;i<bioMarkerDataAdminArr.length; i++){
          if(fullText.description.toLowerCase().includes(((bioMarkerDataAdminArr[i] as any).toLowerCase()).trim()) || (bioMarkerDataAdminArr[i] as any).toLowerCase().trim().includes(fullText.description.toLowerCase())){
              let match = sortedData.filter((data, index)=>{
                  return data.description.toLowerCase() === (bioMarkerDataAdminArr[i] as any).toLowerCase().trim()   
              });
              matches.push(match);
          }
      }
    
      const mapForRange = new Map();
      const mapForResult = new Map();
      const mapForUnit = new Map();
    
      for(let i = 0; i < matches.length; i++){
    
        if(matches[i][0]){
          let yavg = averageCoord(matches[i][0].boundingPoly,'y');
        let xavg = averageCoord(matches[i][0].boundingPoly,'x');     
    
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

                    if(mapForRange.has(matches[i][0].description)){
                      let rangeArr = mapForRange.get(matches[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForRange.set(matches[i][0].description, [withinY[j].description])
                    }
            }
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - (resultX as any)) <= 50){
                    // ////console.log(`result for ${data[i][0].description} is ${withinY[j].description}`);
                    if(mapForResult.has(matches[i][0].description)){
                      let rangeArr = mapForResult.get(matches[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForResult.set(matches[i][0].description, [withinY[j].description])
                    }
           
           }  
            

            if(unitX && Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - unitX) <= 50){
              // ////console.log(`unit for ${data[i][0].description} is ${withinY[j].description}`);
              if(mapForUnit.has(matches[i][0].description)){
                let rangeArr = mapForUnit.get(matches[i][0].description);
                rangeArr.push(withinY[j].description)
              } else{
                mapForUnit.set(matches[i][0].description, [withinY[j].description])
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


      //Function for extracting all biomarkers from Ocr data for the test

      //TODO: Set property name of the biomarker by the name from the DB and not the name in the document
      // approach 2

      async function extractOcrDataBioMarkerNew(propertyName: string){
        
        //creating an array with all the possible test names that could appear in the document
        let tempArr: any = [];
        let testNameArr = testName.map((elem)=>{
          tempArr.push((elem.testName).toLowerCase())
          return tempArr.concat(elem.testScientificName.toLowerCase().split(" "))
        })



        // console.log("testNameArr", testNameArr)

        //Finding matches for the test name in our document from the possible list of test names and then storing their biomarkers in an array
        let bioMarkerDataAdmin: string | any[] = [];
        for(let i = 0; i < testNameArr.length; i++){
          for(let j = 0; j < testNameArr[i].length; j++){
            if(fullText.description.toLowerCase().includes(testNameArr[i][j].toLowerCase())){
              testName.map((elem)=>{
                // console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())

                if(elem.testName.toLowerCase() === testNameArr[i][j].toLowerCase() || elem.testScientificName.toLowerCase() === testNameArr[i][j].toLowerCase()){
                  // console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())
                  bioMarkerDataAdmin = elem.bioMarkers
                }
                  
              })
              
            }
          }
        }



        const filter = {
          name: { $in: bioMarkerDataAdmin },
          isDeleted: false
        };
      
        const bioMarker = await BioMarker.find(filter);

        // const result = await collection.find(filter).toArray(); .toArray();
        
        // console.log("matchedBioMarker", matchedBioMarker)
        // console.log("bioMarkerDataAdmin", bioMarkerDataAdmin)
        let bioMarkerDataAdminArr: any = [];
         let mappingObjArr = [];
         let mappingObj: any = {};
        bioMarkerDataAdmin.map((elem: string)=>{
          // //console.log("elem", elem)

          let matchedBioMarker: any = bioMarker.filter((subElem)=>{
            // //console.log("subElem", subElem)
            return subElem.name === elem;
          })
         
          mappingObj[matchedBioMarker[0].name] = matchedBioMarker[0].name;
          let tempArr = matchedBioMarker[0].alias[0].split(",");
          tempArr.map((element: any)=>{
            mappingObj[element.trim()] = matchedBioMarker[0].name;
          })
          tempArr.push((matchedBioMarker[0].name).toLowerCase())
          // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
          // console.log("tempArr", tempArr)
          bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)

        })
        bioMarkerDataAdminArr = bioMarkerDataAdminArr.map((elem: string)=>{
          return elem.toLowerCase().trim();
        })
        bioMarkerDataAdminArr = [...new Set(bioMarkerDataAdminArr)]
        console.log("mappingObj", mappingObj)


//function for finding elements in the same line        
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

      //Finding the results, units, range line
      const searchStrings: string[] = ['result', 'observation', 'observed'];
      const result = findElementsInSameLine(searchStrings);

      console.log('result', result);

      let rangeVals: string[] = ['range', 'ref', 'interval', 'biological', 'value', 'reference'];

      //function for checking if the matched line contains other expected elements
      function hasMatch(objectsArray: any[], searchStrings: string[]): boolean {
        for (const data of objectsArray) {
          if (searchStrings.includes(data.description.toLowerCase())) {
            return true;
          }
        }
        return false;
      }
      //Double checking if we're in the right line
      if (hasMatch(result, rangeVals)) console.log('Right line');

      rangeVals = ['range', 'ref', 'interval', 'reference', 'biological'];
      const resultVals: string[] = ['result', 'observation', 'value', 'observed'];
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
      //Here we have the order in which the results, units, range appear in our document 
  
      
      //Matching all the ocuurences of BioMarkers in Ocr Document 
      let matches = [];
      
      for(let i=0;i<bioMarkerDataAdminArr.length; i++){
        if(fullText.description.toLowerCase().includes(bioMarkerDataAdminArr[i].toLowerCase().trim())){
          // //console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
          //Get the vertices of the match
          let match = sortedData.filter((data, index)=>{
            return data.description.toLowerCase() === bioMarkerDataAdminArr[i].toLowerCase().trim()    
          });
          matches.push(match);
        }
      }
      

        let bioMarkerDataArr = [];
        console.log("match", matches)
        
        for(let i = 0; i < matches.length; i++){

          let bioMarkerDataObj: any = {};
          let innerObj: any = {};
          
          if(matches[i][0]){
            let yavg = averageCoord(matches[i][0].boundingPoly,'y');
            let xavg = averageCoord(matches[i][0].boundingPoly,'x');     
            
            const withinY = sortedData.filter(obj =>
              Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
              );
            
              withinY.sort((a,b)=>{
                return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x')
              })
              // console.log(`within y for ${data[i][0].description}`,withinY);
              console.log("mappingObj--------lineOrder[elemNum]", mappingObj[matches[i][0].description])

              if(mappingObj[matches[i][0].description]){
                bioMarkerDataObj[mappingObj[matches[i][0].description]] = innerObj;
              } else{
                bioMarkerDataObj[matches[i][0].description] = innerObj;
              }
              
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
        
        // console.log("bioMarkerDataArr", bioMarkerDataArr)
        ocrObj[propertyName] = bioMarkerDataArr;
        // console.log("ocrObj", ocrObj)
      }


    
    
      let rangesArr = ['range'];
      let unitsArr = ['units']
      let resultArr = ['result', 'observation'];
      let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
      let labs = ['labs', 'labrotories', 'hospital', 'diagnostics', 'lab '];
      const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];
      const ageArr = ['age'];
      let genderArr = ['gender', 'sex'];
      let datesArr = ['date of report', 'date', 'reporting date'];
    

    
      extractOcrData(genderArr, "gender", 50, 10)
      extractOcrData(labs, "lab", 150, 10)
      extractOcrData(namesArr, "name", 150, 10)
      extractOcrData(ageArr, "age", 100, 10)
      extractOcrData(datesArr, 'date' ,100, 10);
    

      await extractOcrDataBioMarkerNew("bioMarker")
    
      // console.log(ocrObj)
      // console.log(ocrObj.bioMarker)

      // console.log('Time Elapsed:', performance.now()-time);
      return ocrObj
}
