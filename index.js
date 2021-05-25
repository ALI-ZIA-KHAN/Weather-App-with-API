const http= require('http');
const fs=require('fs');
const path=require("path");  

const express=require("express");
const app=express();

var requests=require('requests');   //npm package to deal with requests

const replaceVal=(tempVal,orgVal)=>{   //WE HAVE PASSED OUR WHOLE CURRENT DATA(homeFile) IN tempVal argument
                                      //where function is called
let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max)
temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min)
temperature=temperature.replace("{%location%}",orgVal.name)
temperature=temperature.replace("{%country%}",orgVal.sys.country)


return temperature;
}

//^^we want to read file only once not every time, just refresh the data

const homeFile=fs.readFileSync("public/home.html","utf-8");
                                                            //copy pasted from npm package


const staticPath=path.join(__dirname,"../public");    //join methods join the path
app.use(express.static(staticPath))                   //builtin middle ware


  //  const server =http.createServer((req,res)=>{
  // if(req.url=="/"){                                            
  //   requests('http://api.openweathermap.org/data/2.5/weather?q=Karachi&units=metric&appid=3beadb6c3a6c6d3d1765b5a3e9691463')
    
  //   .on('data', (chunk)=> {           //chunk log kraaya to API ka data tha      //streaming:bcz we rcv data in chunks so show as per rcv


      
  //       const objdata=JSON.parse(chunk);
  //        const arrData=[objdata];   //made array so we can map
  //        const realTimeData=arrData.map(curval=> replaceVal(homeFile,curval)).join("");    
        
        
  //         res.write(realTimeData);                                            //best adv of map we just hv to write . to get what we want
  //                                                               // not to go for index values
             
  //       //   console.log(realTimeData);
  //       })
  //   .on('end',(err)=> {
  //     if (err) return console.log('connection closed due to errors', err);
     
  //     res.end();
  //   });
  // }
  // });



  app.get("/",(req,res)=>{
    // res.render("about");
    requests(`http://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=3beadb6c3a6c6d3d1765b5a3e9691463`)
    
    .on('data', (chunk)=> {           //chunk log kraaya to API ka data tha      //streaming:bcz we rcv data in chunks so show as per rcv


      
         const objdata=JSON.parse(chunk);
         const arrData=[objdata];   //made array so we can map
         console.log(arrData); 
        //  console.log(`the city name is ${arrData[0].name} and temp is ${arrData[0].main.temp}`) ; 
        // const celcius=  (arrData[0].main.temp/10)
        
        //   res.write(`the city name is ${arrData[0].name} and temp is ${celcius}`);                                            //best adv of map we just hv to write . to get what we want
                                                                  // not to go for index values
             
        //   console.log(realTimeData);

        const realTimeData=arrData.map(curval=> replaceVal(homeFile,curval)).join("");
        res.write(realTimeData); 

        })
    .on('end',(err)=> {
      if (err) return console.log('connection closed due to errors', err);
     
      res.end();
    });

  });





    app.listen(5000,()=>{
      console.log("listing the port at 5000")
  })
