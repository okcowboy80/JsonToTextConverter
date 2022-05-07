
document.getElementById("convertBtn").addEventListener("click", function() {
   clickHandler();
});

function clickHandler() {
   const selectedFile = document.getElementById('jsonFile').files[0];
   if (selectedFile) {
         var fileread = new FileReader();
         fileread.onload = function(e) {
            var content = e.target.result;
            var parsed = JSON.parse(content); 
            //console.log(intern); 
            displayContents(parsed);
       };
       fileread.readAsText(selectedFile);

   } else {
      const text = JSON.parse(document.getElementById("textarea").value)
      displayContents(text);
   }
   
}

function displayContents(arr) {
   document.write(`<h1 style="text-align: center; margin-top: 25px; font-family: arial;">Chat Logs</h1>`);
   for (var i = 0; i < arr.cases.length; i++){
      document.write(`<br><br><div style="font-family: arial; background-color: #b7bcc4; margin: 0 15px 0 15px; padding: 10px; border-radius: 10px 10px 0 0;"><strong>Chat Log: ${(i+1)} </strong></div>`);
      var obj = arr.cases[i];
      for (var key in obj){
        var value = obj[key];
        var capitalFirst = key[0].toUpperCase();
        if(key.toString().toLowerCase().includes("transcripts") || key.toString().toLowerCase().includes("javascript_variables") || key.toString().toLowerCase().includes("labels" ) || key.toString().toLowerCase().includes("operator_variables" )) {
          document.write(`<div style="font-family: arial; background-color: #e6edf7; margin: 0 15px 0 15px; padding: 10px;"> * <strong>${capitalFirst + key.replaceAll("_", " ").substring(1, key.length)}</strong>: ${JSON.stringify(value)}</div>`);
        } else {
         document.write(`<div style="font-family: arial; background-color: #e6edf7; margin: 0 15px 0 15px; padding: 10px;"> * <strong>${capitalFirst + key.replaceAll("_", " ").substring(1, key.length)}</strong>: ${value}</div>`);
        }
      }
   }
} 



