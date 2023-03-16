
function getDate(unformattedDate){

    try{

        if(unformattedDate.split(" ").length === 2){
            unformattedDate = unformattedDate.split(" ")[0]
        }
        console.log("unformattedDate", unformattedDate, unformattedDate.split(" "))
        let newStr = unformattedDate.replace(/\s/g, '');
        newStr = newStr.replace("am", " am");
        newStr = newStr.replace("pm", " pm");
        // newStr = newStr.match(/^\d{2}-[a-z]{3}-\d{4}/)[0];
        let index = newStr.indexOf(":");

        if(index !== -1)
        newStr = newStr.slice(0,index-2);

        console.log("index", index)
        console.log("newStr", newStr)
        if(newStr.includes("/")){
            newDate = newStr.split("/");
            let swap = newDate[0];
            newDate[0] = newDate[1];
            newDate[1] = swap;
            newStr = newDate.join("/");
        }
        if(newStr.includes("-")){
            newDate = newStr.split("-");
            let swap = newDate[0];
            newDate[0] = newDate[1];
            newDate[1] = swap;
            newStr = newDate.join("-");
        }
        let date = new Date(newStr);
        // const date = new Date()

        console.log("date", date)

        const utcString = date.toISOString();
        
        if(!unformattedDate.includes("-") || (/[a-zA-Z]/).test(unformattedDate)){
            const inputDate = utcString;
            const date = new Date(inputDate);
            const newDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
            const outputDate = newDate.toISOString();
            console.log(outputDate); 
            return outputDate.split("T")[0];
        } else{
            console.log(utcString); 
            return utcString.split("T")[0]; 
        }
    }catch(e) {
        console.log("error", e);
    }

}

// console.log(getDate("08 - jan - 2022 07:23 am"))
// console.log(getDate("08 - jan - 2022 / 07:23 am"))
// console.log(getDate("08 - 01 - 2022 07:23:00 am")) 
// console.log(getDate("8 jan 2023"))

// console.log(getDate("08/01/2023 11:55 pm"))
// console.log(getDate("08/01/2023"))
// console.log(getDate("29-Aug-22 07:06 PM"))
// console.log(getDate("29/Aug/2022 03:52PM"))
// console.log(getDate("2023-03-15")) // ---> not solved