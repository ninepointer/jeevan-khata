import { NextFunction } from "express";
// import CatchAsync from "../middlewares/CatchAsync";
import TestName from "../models/LabTest"
import BioMarker from "../models/BioMarker";
import { Data } from "aws-sdk/clients/firehose";
// import tempOcrData from "./tempOcrData"


export const ocrProccesing = async(ocrData: any) => {

  //CONFIRMING THE RESPONSE FROM GOOGLE OCR HAS SOME DATA
  if(!ocrData.length) return;

  //FIND ALL THE TESTS FROM DB
  const testName = await TestName.find({isDeleted: false});

  //FIND ALL BIO MARKERS
  //TODO: FOR @Vijay; We only need the biomarkers after the test name matches. 
  const bioMarker = await BioMarker.find({isDeleted: false});
  
  let ocrObj: any = {};

  //Get the full text from Ocr data
  let fullText = ocrData[0].textAnnotations[0];

  //Get the working data from Ocr data
  let workingData = [... ocrData[0].textAnnotations];
  workingData.splice(0,1);  
  
  //FUNCTION TO GET THE AVERAGE COORDINATES
  function averageCoord(boundingPoly: { vertices: any[]; }, xy: string){
      return (boundingPoly.vertices.map((item)=>item[xy]).reduce((total, currentValue)=> total+currentValue, 0)/boundingPoly.vertices.length);
  
  }
  //Sort the data by the average of Y coordinate
  let sortedData = [...workingData]

  sortedData.sort(function(a, b) {
      return averageCoord(a.boundingPoly, 'y') - averageCoord(b.boundingPoly, 'y'); 
  });
    
          
  //STRICTLY FOR MONITORING PERFORMANCE
  let time = performance.now(); 

  //Function for extracting name, date from Ocr data
  async function extractOcrDataNew(propertyName: string, Arr: any){

    let matches = [];
    
    for(let i=0;i<Arr.length; i++){
      if(fullText.description.toLowerCase().includes(Arr[i].toLowerCase().trim())){
        //Get the vertices of the match
        let match = sortedData.filter((data, index)=>{
          return data.description.toLowerCase() === Arr[i].toLowerCase().trim()    
        });
        matches.push(match);
      }
    }
    //console.log("matches", matches);
    for(let i = 0; i < matches.length; i++){
      
      if(matches[i][0]){
        let yavg = averageCoord(matches[i][0].boundingPoly,'y');
        let xavg = averageCoord(matches[i][0].boundingPoly,'x');     

        let withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10 && averageCoord(obj.boundingPoly,'x') >= xavg  && obj.description !== ":" && obj.description.toLowerCase() !== "mrs." && obj.description.toLowerCase() !== "ms."
        );

        withinY.sort(function(a, b) {
          return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x'); 
        });
        //console.log(`within y for ${matches[i][0]}`,withinY);

        let temp = '';
        let coord = [];
        let isFirst = true;    
        for(let j = 0; j<withinY.length; j++){
          if(coord.length>0){
            if(withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 8){
              console.log(`${temp}` + ` ${withinY[j].description}`);
              temp += ` ${withinY[j].description}`; 
              coord = withinY[j].boundingPoly.vertices;
            }
            else{
              
              if(!isFirst){
                
                console.log(`this is temp: ${temp}`);
                ocrObj[propertyName] = temp.trim();
                temp = ` ${withinY[j].description}`;
                coord = withinY[j].boundingPoly.vertices;
                return;
              } else{
                temp = ` ${withinY[j].description}`; 
                console.log(`this is temp in else: ${temp}`);
                ocrObj[propertyName] = temp.trim();
                coord = withinY[j].boundingPoly.vertices;
                isFirst = false;
              }

            }
          }else{
            ////console.log(`setting temp ${withinY[j].description}`);
            // //console.log(`checking for ${lineOrder[elemNum]}`);
            temp = withinY[j].description; 
            coord = withinY[j].boundingPoly.vertices;
          }
        }

        if(temp.substring(0,4).toLowerCase().includes("mr.")){
          temp = temp.slice(4, temp.length);
        }
        
        if(propertyName === "date"){
          try{
            ocrObj[propertyName] = getDate(temp.trim())
          } catch {
            ocrObj[propertyName] = temp.trim();
          }
        } else{
          ocrObj[propertyName] = temp.trim();
        }

        temp = '';
        coord = [];  
      }
    }  
    
    console.log("ocrObj for diffrent properties", ocrObj)
  }

  //Function for extracting all biomarkers from Ocr data
  async function extractOcrDataBioMarkerNewWithRegex(propertyName: string){
    
    //creating an array with all the possible test names that could appear in the document
    let tempArr: any = [];
    let testNameArr = testName.map((elem)=>{
      tempArr.push((elem.testName).toLowerCase())
      return tempArr.concat(elem.testScientificName.toLowerCase().split(" "))
    })


    //Finding matches for the test name in our document from the possible list of test names and then storing their biomarkers in an array
    let bioMarkerDataAdmin: string | any[] = [];
    for(let i = 0; i < testNameArr.length; i++){
      for(let j = 0; j < testNameArr[i].length; j++){
        if(fullText.description.toLowerCase().includes(testNameArr[i][j].toLowerCase())){
          testName.map((elem)=>{

            if(elem.testName.toLowerCase() === testNameArr[i][j].toLowerCase() || elem.testScientificName.toLowerCase() === testNameArr[i][j].toLowerCase()){
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

    let bioMarkerDataAdminArr: any = [];
    let mappingObj: any = {};

    bioMarkerDataAdmin.map((elem: string)=>{
      let matchedBioMarker: any = bioMarker.filter((subElem)=>{
        return subElem.name === elem;
      })
      
      mappingObj[matchedBioMarker[0].name] = matchedBioMarker[0].name;
      let tempArr = matchedBioMarker[0].alias[0].split(",");
      tempArr.map((element: any)=>{
        mappingObj[element.trim()] = matchedBioMarker[0].name;
      })
      tempArr.push((matchedBioMarker[0].name).toLowerCase())
      bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)
    })

    bioMarkerDataAdminArr = bioMarkerDataAdminArr.map((elem: string)=>{
      return elem.toLowerCase().trim();
    })
    bioMarkerDataAdminArr = [...new Set(bioMarkerDataAdminArr)]

    //Matching all the ocuurences of BioMarkers in Ocr Document 
    let matches = [];
  
    for(let i=0;i<bioMarkerDataAdminArr.length; i++){
      if(fullText.description.toLowerCase().includes(bioMarkerDataAdminArr[i].toLowerCase().trim())){
        //Get the vertices of the match
        let match = sortedData.filter((data, index)=>{
          return data.description.toLowerCase() === bioMarkerDataAdminArr[i].toLowerCase().trim()    
        });
        matches.push(match);
      }
    }
  

    let bioMarkerDataArr = [];
    
    for(let i = 0; i < matches.length; i++){

      let bioMarkerDataObj: any = {};
      let innerObj: any = [];
      
      if(matches[i][0]){
        let yavg = averageCoord(matches[i][0].boundingPoly,'y');
        let xavg = averageCoord(matches[i][0].boundingPoly,'x');     
        
        const withinY = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
        );
        
        withinY.sort((a,b)=>{
          return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x')
        })

          
        let temp = '';
        let coord = [];
        let elemNum =0; 
        let isFirst = true;    

        // combine all words with small space
        for(let j = 0; j<withinY.length; j++){
          if(coord.length>0){
            if(withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 8){
              temp += withinY[j].description;
              coord = withinY[j].boundingPoly.vertices;
            }
            else{
              if(!isFirst){
                innerObj.push(temp);
                // console.log(`${lineOrder[elemNum]}: ${temp}`);
                temp = withinY[j].description;
                coord = withinY[j].boundingPoly.vertices;
                elemNum++;
              } else{
                temp = withinY[j].description;
                coord = withinY[j].boundingPoly.vertices;
                isFirst = false;
              }
            }
          }else{
            temp = withinY[j].description;
            coord = withinY[j].boundingPoly.vertices;
          }
        }
        innerObj.push(temp);

        if(mappingObj[matches[i][0].description]){
          console.log("inner obj from mapping obj", innerObj)
          let finalObj = getDataFromWithinY(innerObj);
          bioMarkerDataObj[mappingObj[matches[i][0].description]] = finalObj;
        } else{
          console.log("inner obj from mapping obj else condition", innerObj)
          let finalObj = getDataFromWithinY(innerObj);
          bioMarkerDataObj[matches[i][0].description] = finalObj;
        }

        bioMarkerDataArr.push(bioMarkerDataObj);
      }
    }  
    console.log("bioMarkerDataArr", bioMarkerDataArr)
    ocrObj[propertyName] = bioMarkerDataArr;
  }


  // Helper functions.

  // regex function for matching range, result for biomarkers
  function getDataFromWithinY(withinYArr: any){
    console.log("getDataFromWithinY", withinYArr)
    let obj: any = {};
    const regexForRange = /.*-.*$/; 
    const range = withinYArr.filter((elem: string) => regexForRange.test(elem));
    const regexForResult = /^\d+\.?\d*$/; 
    const result = withinYArr.filter((elem: string) => regexForResult.test(elem));
    obj.range = range[0];
    obj.result = result[0];
    return obj;
  }

  //Function to extract Data and add it to final Object
  function getDate(unformattedDate: any) {

    try {
  
      if (unformattedDate.split(" ").length === 2) {
        unformattedDate = unformattedDate.split(" ")[0];
      }
      
      let newStr: any = unformattedDate.replace(/\s/g, '');
      newStr = newStr.replace("am", " am");
      newStr = newStr.replace("pm", " pm");
  
      let index = newStr.indexOf(":");
  
      if (index !== -1) {
        newStr = newStr.slice(0, index - 2);
      }
  
      console.log("index", index);
      console.log("newStr", newStr);
  
      let newDate: any;
  
      if (newStr.includes("/")) {
        newDate = newStr.split("/");
        let swap = newDate[0];
        newDate[0] = newDate[1];
        newDate[1] = swap;
        newStr = newDate.join("/");
      }
  
      if (newStr.includes("-")) {
        newDate = newStr.split("-");
        let swap = newDate[0];
        newDate[0] = newDate[1];
        newDate[1] = swap;
        newStr = newDate.join("-");
      }
  
      let date = new Date(newStr);
  
      console.log("date", date);
  
      const utcString = date.toISOString();
  
      if (!unformattedDate.includes("-") || (/[a-zA-Z]/).test(unformattedDate)) {
        const inputDate = utcString;
        const date = new Date(inputDate);
        const newDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        const outputDate = newDate.toISOString();
        console.log(outputDate);
        return outputDate.split("T")[0];
      } else {
        console.log(utcString);
        return utcString.split("T")[0];
      }
    } catch (e) {
      console.log("error", e);
    }
  
  }

    
      
  let rangesArr = ['range'];
  let unitsArr = ['units']
  let resultArr = ['result', 'observation'];
  let bioMarkersArr = ['Hemoglobin', "RBC", "HCT", "MCV", "MCH", "MCHC", "RDW-CV", "RDW-SD", "WBC", "NEU", "LYM", "MON", "EOS", "BAS", "LYM", "GRA", "PLT", "ESR"]
  let labs = ['labs', 'labrotories', 'hospital', 'diagnostics', 'lab'];
  const namesArr = ['patient', 'name', 'pt.name', 'pt. name', 'patient name' ];
  const ageArr = ['age'];
  let genderArr = ['gender', 'sex'];
  let datesArr = ['date of report', 'report date','reporting date', 'reported', 'date'];
    

    
  // extractOcrData(genderArr, "gender", 50, 10)
  // extractOcrData(labs, "lab", 150, 10)
  // extractOcrData(namesArr, "name", 150, 10)
  // extractOcrData(ageArr, "age", 100, 10)
  // extractOcrData(datesArr, 'date' ,100, 10);
  // await extractOcrDataNew("name", namesArr);
  // await extractOcrDataNew("date", datesArr);
  // await extractHospitalName("lab", labs);
  // await extractOcrDataBioMarkerNew("bioMarker");

  await extractOcrDataBioMarkerNewWithRegex("bioMarker");
  console.log(ocrObj.bioMarker)
  return ocrObj
}
