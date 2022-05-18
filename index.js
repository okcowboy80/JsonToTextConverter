
document.getElementById("convertBtn").addEventListener("click", function() {
   clickHandler();
});

document.getElementById("exportCSV").addEventListener("click", function() {
   exportHandler();
});

function clickHandler() {
   const selectedFile = document.getElementById('jsonFile').files[0];
   if (selectedFile) {
         var fileread = new FileReader();
         fileread.onload = function(e) {
            var content = e.target.result;
            var parsed = JSON.parse(content); 
            displayContents(parsed);
       };
       fileread.readAsText(selectedFile);

   } else if(document.getElementById("textarea").value) {
      const text = JSON.parse(document.getElementById("textarea").value)
      displayContents(text);
   } else {

      const text = document.getElementById("urlText").value
      console.log(text)
      fetch(text, requestOptions)
       .then((response) => {
          console.log(response)
          displayContents(response)
         })
       .catch((err => {
          document.write(`The URL returned an error: ${err}`)
       }))
   }
   
}

function exportHandler() {

   const date = new Date();
   const day = date.getDate();
   const month = date.getMonth() + 1;
   const year = date.getFullYear();

   const selectedFile = document.getElementById('jsonFile').files[0];
   if (selectedFile) {
         var fileread = new FileReader();
         fileread.onload = function(e) {
            var content = e.target.result;
            var parsed = JSON.parse(content); 
            displayContents(parsed);
            exportCSVFile(parsed, `Chat_Logs_${month}-${day}-${year}`);

       };
       fileread.readAsText(selectedFile);

   } else if(document.getElementById("textarea").value) {
      const text = JSON.parse(document.getElementById("textarea").value)
      displayContents(text);
      exportCSVFile(text, `Chat_Logs_${month}-${day}-${year}`);
   } else {

      const text = document.getElementById("urlText").value
      console.log(text)
      fetch(text, requestOptions)
       .then((response) => {
          console.log(response)
         displayContents(response)
         exportCSVFile(response, `Chat_Logs_${month}-${day}-${year}`);
          response.headers.set(AccessControlAllowOrigin)
         })
       .catch((err => {
          document.write(`The URL returned an error: ${err}`)
       }))
   }
   
}

function goback() {
   location.reload();
}

function displayContents(arr) {
   
   document.write(`<h1 style="text-align: center; margin-top: 25px; font-family: arial;">Chat Logs</h1>`);
   document.write(`<button style="margin-left: 25px;" type="button" onclick="goback()">Home</button>`);
   if(!arr.cases) {
      document.write("<br><br><h3>No Chat Logs to display.</h3><br><h3>Ensure that you are using a chat log API .json file.</h3>")
   } else {
      for (var i = 0; i < arr.cases.length; i++){
         document.write(`<br><br><div style="font-family: arial; background-color: #b7bcc4; margin: 0 15px 0 15px; padding: 10px; border-radius: 10px 10px 0 0;"><strong>Chat Log: ${(i+1)} </strong></div>`);
         var obj = arr.cases[i];
         for (var key in obj){
           var value = obj[key];
           var capitalFirst = key[0].toUpperCase();
           if(key.toString().toLowerCase().includes("transcripts") || key.toString().toLowerCase().includes("javascript_variables") || key.toString().toLowerCase().includes("labels" ) || key.toString().toLowerCase().includes("operator_variables" )) {
             document.write(`<div style="font-family: arial; background-color: #e6edf7; margin: 0 15px 0 15px; padding: 10px;"> * <strong>${capitalFirst + key.replaceAll("_", " ").substring(1, key.length)}</strong>: ${JSON.stringify(value)}</div>`);
           } else {
              if(key.toString() === "created_at_date") {
               var date = new Date(value);

               //var fdate = date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2);
               var fdate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
               var newDate = new Date(value).toISOString().substr(0, 10).replace(/-/g, '/');
               //console.log(fdate)
               document.write(`<div style="font-family: arial; background-color: #e6edf7; margin: 0 15px 0 15px; padding: 10px;"> * <strong>${capitalFirst + key.replaceAll("_", " ").substring(1, key.length)}</strong>: ${fdate}</div>`);
               
              } else {
                  document.write(`<div style="font-family: arial; background-color: #e6edf7; margin: 0 15px 0 15px; padding: 10px;"> * <strong>${capitalFirst + key.replaceAll("_", " ").substring(1, key.length)}</strong>: ${value}</div>`);
              }
            
           }
         }
      }
   }
   
} 

// functions below are for exporting content to a CSV file

function convertToCSV(objArray) {
   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
   var str = '';
   //console.log(array.cases.length)
   for (var i = 0; i < array.cases.length; i++) {
       var line = '';
       for (var index in array.cases[i]) {
           if (line != '') line += ','
               line += "\n" + "*" + index + ","; 
           if(typeof array.cases[i][index] === 'object') {
               for(var nextIndex in array.cases[i][index]) {
                  line += JSON.stringify(array.cases[i][index][nextIndex]).toString().replaceAll(',', ' ').replaceAll('\n', ' ');
               }
           } else {
               line += array.cases[i][index].toString().replaceAll(',', ' ').replaceAll('\n', ' ');
           }
            
       }

       str += line + '\r\n';
   }
   return str;
}

async function exportCSVFile(items, fileTitle) {

   // Convert Object to JSON
   var jsonObject = JSON.stringify(items);

   var csv = await this.convertToCSV(jsonObject);

   var exportedFilename = fileTitle + '.csv' || 'export.csv';

   var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
   if (navigator.msSaveBlob) { // IE 10+
       navigator.msSaveBlob(blob, exportedFilename);
   } else {
       var link = document.createElement("a");
       if (link.download !== undefined) { 
           var url = URL.createObjectURL(blob);
           link.setAttribute("href", url);
           link.setAttribute("download", exportedFilename);
           link.style.visibility = 'hidden';
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
       }
   }
}



