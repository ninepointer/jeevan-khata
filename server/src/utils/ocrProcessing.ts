import { NextFunction } from "express";
import CatchAsync from "../middlewares/CatchAsync";
import TestName from "../models/LabTest"
import BioMarker from "../models/BioMarker";


export const ocrProccesing = async(ocrData: any) => {


  const testName = await TestName.find({isDeleted: false});
  const bioMarker = await BioMarker.find({isDeleted: false})
    // console.log("testName", (testName as any), (bioMarker as any).data)
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
        console.log("possibleArr", possibleArr)
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
      
      
      function extractOcrDataBiomarker(possibleArr: string | any[], resultArr: any, unitsArr: any, rangesArr: any){
        console.log("testName", testName, bioMarker)

        let testNameArr = testName.map((elem)=>{
          return (elem.testName).toLowerCase().split(" ").concat(elem.testScientificName.toLowerCase().split(" "))
        })



        console.log("testNameArr", testNameArr)
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
          console.log("elem", elem)
          let matchedBioMarker: any = bioMarker.filter((subElem)=>{
            console.log("subElem", subElem)
            return subElem.name === elem;
          })
          console.log("matchedBioMarker", matchedBioMarker)
          let tempArr = matchedBioMarker[0].alias[0].split(",");
          tempArr.push((matchedBioMarker[0].name).toLowerCase())
          // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
          console.log("tempArr", tempArr)
          bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)

        })

        console.log("bioMarkerDataAdmin", bioMarkerDataAdminArr)

    
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
    
    // console.log(withinResultY); 
    
    let rangeX;
    for(let i = 0; i < rangesArr.length; i++){
      let range = withinResultY.filter((item)=>item.description.toLowerCase() ==  rangesArr[i]);
      // console.log("range", range); 
      rangeX = averageCoord(range[0]?.boundingPoly,'x');
      if(range.length){
        break;
      }
    }

    
    
    // getting unit
    
    let unitX;
    for(let i = 0; i < unitsArr.length; i++){
      let unit = withinResultY.filter((item)=>item.description.toLowerCase() == unitsArr[i]);
      // //console.log("range", range);
      unitX = averageCoord(unit[0]?.boundingPoly,'x');
      
      if(unit.length){
         break;
      }
    }
    
    
    //console.log("unitX", unitX); 
    let resultX
    for(let i = 0; i < resultArr.length; i++){
      let result = withinResultY.filter((item)=>item.description.toLowerCase() == resultArr[i]);
      ////console.log("result", result); 'result' || observation
      
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
    
        ////console.log(`within y for ${data[i][0].description}`,withinY);
    
    
        for(let j = 0; j<withinY.length; j++){
            // ////console.log(withinY.length);
            console.log(rangeX, averageCoord(withinY[j].boundingPoly, 'x'), withinY[j].boundingPoly.vertices[1].x)
            //     , withinY[j].boundingPoly.vertices[2].x, withinY[j].boundingPoly.vertices[3].x));
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - (rangeX as any)) <= 50){
                    console.log(`range for ${data[i][0].description} is ${withinY[j].description}`);

                    if(mapForRange.has(data[i][0].description)){
                      let rangeArr = mapForRange.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForRange.set(data[i][0].description, [withinY[j].description])
                    }
            }
            if(Math.abs(averageCoord(withinY[j].boundingPoly, 'x') - (resultX as any)) <= 50){
                    // //console.log(`result for ${data[i][0].description} is ${withinY[j].description}`);
                    if(mapForResult.has(data[i][0].description)){
                      let rangeArr = mapForResult.get(data[i][0].description);
                      rangeArr.push(withinY[j].description)
                    } else{
                      mapForResult.set(data[i][0].description, [withinY[j].description])
                    }
           
           }  
            

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
    
      extractOcrDataBiomarker(bioMarkersArr, resultArr, unitsArr, rangesArr)
    
      console.log(ocrObj)
      console.log(ocrObj.bioMarker)

      return ocrObj
}