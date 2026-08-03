var express=require("express");

var app=express();
app.use(express.static("public"));//index.html will open
app.use(express.urlencoded(true));


app.listen(2006,function(){
    console.log("Server Started");
})

//Gen_Ai
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JzWh_U0Uw9iB97oQG-52JyD_4iLL0eFW1X_N7ddx8ZPg");
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });


app.get("/",function(req,resp){
    var path=__dirname+"/public/index.html";
    resp.sendFile(path);
})
//=====mysql=================
var fileuploader=require("express-fileupload");
app.use(fileuploader());//does not upload file by itself it enables your express server to recieve and process uploaded files from the client
app.use(express.urlencoded(true));
var cloudinary=require("cloudinary").v2;
var mysql=require("mysql2");
require('dotenv').config();

cloudinary.config({

    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_Key,//click view api keys above to copy youe api
});


let url=process.env.AIVEN_URL;
console.log(url)
 let mysqlCon=mysql.createConnection(url);
mysqlCon.connect(function(err){
    if(err==null)
        console.log("connected successfully");
    else
    console.log("err.message");

})
//==========ajax=======================
//check email is already or not
app.get("/check-email",function(req,resp){
    let email=req.query.emailKuch;
    mysqlCon.query("select * from userspro where emailid=?",[email],function(err,resultJSONAry){
        if(err==null){
            if(resultJSONAry.length==1)
                resp.send("Already Occupied");
            else
            resp.send("Available");
        }
        else
        resp.send("err.message");
    })
})
//=====send data to server===========
app.get("/signup-process-ajax",function(req,resp){
    let email=req.query.emailKuch;
    let pwd=req.query.pwdKuch;
    let utype=req.query.utypeKuch;
let active=1
    mysqlCon.query("insert into userspro values(?,?,?,current_date(),1)",[email,pwd,utype],function(err)
    {
        if (err==null)
           resp.send(" welcome, record saved successfullyyy");
       else
           resp.send(err.message);
    })

})
//=======login==========
app.get("/login-process-ajax",function(req,resp){
    let email=req.query.emailKuchlogin;
    let pwd=req.query.pwdKuchlogin;
     mysqlCon.query("select * from userspro where emailid=? and pwd=?",[email,pwd],function(err,resultJSONAry){
        if(err==null){
            if(resultJSONAry.length==1){
                if(resultJSONAry[0].active==1)
                {
                    resp.send(resultJSONAry[0].utype);
                }
                else
                resp.send("INVALID USER ID OR PASSWORD");
                

            }
            else
            resp.send("INVALID USER ID OR PASSWORD");
        }
        else
        resp.send(err.message);
     })
    })
    //=========donor and avail med files linking-equip
    app.get("/donorprofile", function(req, resp) {
        var path=__dirname+"/public/donor-profile.html";
            resp.sendFile(path);
    });
    app.get("/availEquip", function(req, resp) {
        var path=__dirname+"/public/availEquip.html";
            resp.sendFile(path);
    });
    app.get("/donorprofile", function(req, resp) {
        var path=__dirname+"/public/donor-profile.html";
            resp.sendFile(path);
    });
    //=========DONOR/AVAIL LINKING=============
    app.get("/donorprofile", function(req, resp) {
        var path=__dirname+"/public/donor-profile.html";
            resp.sendFile(path);
    });
    app.get("/availmed", function(req, resp) {
        var path=__dirname+"/public/availmed.html";
            resp.sendFile(path);
    });
    //=========SEND DATA TO SERVER===========
 app.post("/send-data", async function(req,resp){
        //File Uploading
        let msg="File not uploaded";
        let myUrl="nopic.jpg";
        if(req.files!=null)
        {
            let fileName=req.files.acard.name;
            let fullPath=__dirname+"/uploads/"+fileName;
            await req.files.acard.mv(fullPath);
            msg="uploaded successfully";
    
            await cloudinary.uploader.upload(fullPath).then(function(picUrlResult){
                myUrl=picUrlResult.url;//will give you url of your pic on cloudinary server
                console.log("************")
                console.log(myUrl);
    
            });
        
        }
         //File Uploading
         let msg2="File not uploaded";
         let myUrl2="nopic.jpg";
         if(req.files!=null)
         {
             let fileName2=req.files.profilePic.name;
             let fullPath2=__dirname+"/uploads/"+fileName2;
             await req.files.profilePic.mv(fullPath2);
             msg2="uploaded successfully";
     
             await cloudinary.uploader.upload(fullPath2).then(function(picUrlResult2){
                 myUrl2=picUrlResult2.url;//will give you url of your pic on cloudinary server
                 console.log("************")
                 console.log(myUrl2);
     
             });
         
         }
         let emailid=req.body.inputEmail;
         let name=req.body.inputName;
         let mobile=req.body.inputMobile;
         let address=req.body.inputAddress;
         let city=req.body.inputCity;

         mysqlCon.query("insert into dprofiles values(?,?,?,?,?,?,?)",[emailid,name,mobile,address,city,myUrl,myUrl2],function(err){
            if(err==null){
               // resp.send("congratulations!!record saved successfully");
               resp.sendFile(__dirname+"/public/response.html");

         }
            else
            resp.send(err.message);
         })


    });

    //========update===========
    app.post("/update-data", async function(req,resp){
        //File Uploading
        let msg="File not uploaded";
        let myUrl="nopic.jpg";
        if(req.files!=null&& req.files.acard!=null)
        {
            let fileName=req.files.acard.name;
            let fullPath=__dirname+"/uploads/"+fileName;
            await req.files.acard.mv(fullPath);
            msg="uploaded successfully";
    
            await cloudinary.uploader.upload(fullPath).then(function(picUrlResult){
                myUrl=picUrlResult.url;//will give you url of your pic on cloudinary server
                console.log("************")
                console.log(myUrl);
    
            });
        
        }
        else
    {
        myUrl=req.body.hdnAdhar;
    }
    
         //File Uploading
         let msg2="File not uploaded";
         let myUrl2="nopic.jpg";
         if(req.files!=null&&req.files.profilePic!=null)
         {
             let fileName2=req.files.profilePic.name;
             let fullPath2=__dirname+"/uploads/"+fileName2;
             await req.files.profilePic.mv(fullPath2);
             msg2="uploaded successfully";
     
             await cloudinary.uploader.upload(fullPath2).then(function(picUrlResult2){
                 myUrl2=picUrlResult2.url;//will give you url of your pic on cloudinary server
                 console.log("************")
                 console.log(myUrl2);
     
             });
         
         }
         else{
            myUrl2=req.body.hdnProfile;
         }
         let emailid=req.body.inputEmail;
         let name=req.body.inputName;
         let mobile=req.body.inputMobile;
         let address=req.body.inputAddress;
         let city=req.body.inputCity;

        
        mysqlCon.query("update  dprofiles set name=?,mobile=?,address=?,city=?,acardpath=?,picpath=? where emailid=?",[name,mobile,address,city,myUrl,myUrl2,emailid],function(err){
            if(err==null)
                resp.send("congratulations!!updated saved successfully");
            else
            resp.send(err.message);
         })
 
})
    app.get("/fetch-one",function(req,resp){
        let email=req.query.emailidKuch;
    mysqlCon.query("select * from dprofiles where emailid =?",[email],function(err,resultone){//? is called parameter
        if(err==null)
            {
             resp.send(resultone);
        }
        else
        resp.send(err.message);
    })

    })

    //=========for avial send to server ================
    //=============AVIL-MEDICINE===================
app.post("/med-data",async function(req,resp){
    
    
    //File uploading
    let msg="File Not Uploaded";
    let myUrl="nopic.jpg";


    if(req.files!=null)
    {
        let fileName=req.files.medPic.name;//uploaded files goes in file object 
        let fullPath=__dirname+"/uploads/"+fileName;
        await req.files.medPic.mv(fullPath);//saving pic in upload folder
        msg="uploaded Successfully";   

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            myUrl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl);
        })
    }
    
    let emailid=req.body.inputEmail;
    let medname=req.body.inputMedName;
    let expdate=req.body.inputDate;
    let company=req.body.inputCompany;
    let packing=req.body.packing
    let qty=req.body.qty;
    let info=req.body.inputInfo;
    


    mysqlCon.query("insert into medecine values(?,?,?,?,?,?,?,?,?)",[null,emailid,medname,expdate,company,packing,qty,info,myUrl],function(err){
            
        if(err==null){
            resp.sendFile(__dirname+"/public/response.html");
        
           // resp.send("Badhaii!!!! Record Saved Successfully");
        }
        else
            resp.send(err.message);
    })

})

//========send data to server==========
//============availequip==============

app.post("/equip-data", async function(req,resp){
    //File Uploading
    let msg="File not uploaded";
    let myUrl="nopic.jpg";
    if(req.files!=null)
    {
        let fileName=req.files.Pic.name;
        let fullPath=__dirname+"/uploads/"+fileName;
        await req.files.Pic.mv(fullPath);
        msg="uploaded successfully";

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult){
            myUrl=picUrlResult.url;//will give you url of your pic on cloudinary server
            console.log("************")
            console.log(myUrl);

        });
    
    }
     //File Uploading
     let msg2="File not uploaded";
     let myUrl2="nopic.jpg";
     if(req.files!=null)
     {
         let fileName2=req.files.Pic2.name;
         let fullPath2=__dirname+"/uploads/"+fileName2;
         await req.files.Pic2.mv(fullPath2);
         msg2="uploaded successfully";
 
         await cloudinary.uploader.upload(fullPath2).then(function(picUrlResult2){
             myUrl2=picUrlResult2.url;//will give you url of your pic on cloudinary server
             console.log("************")
             console.log(myUrl2);
 
         });
     
     }
     let emailid=req.body.inputEmail;
     let equipment =req.body.inputEquip;
     let conditions=req.body.condition;
     let type=req.body.radioAmount;
     let amount=req.body.inputAmount;
     let info=req.body.inputInfo;


     mysqlCon.query("insert into equipments values(?,?,?,?,?,?,?,?,?)",[null,emailid,equipment,conditions,type,amount,myUrl,myUrl2,info],function(err){
        if(err==null){
           // resp.send("congratulations!!record saved successfully");
           resp.sendFile(__dirname+"/public/response.html");
     }
        else
        resp.send(err.message);
     })


});
//======angular======admin users dash====================
//========linking=======================
app.get("/adminusers", function(req, resp) {
    var path=__dirname+"/public/admin-users-dash.html";
        resp.sendFile(path);
});
//===========angular js http showall=============

app.get("/fetch-all",function(req,resp){
    mysqlCon.query("select * from userspro",function(err,resultJSONAry){//show time 2nd parameter result json ary houga and delete time result
        if(err==null){
            resp.send(resultJSONAry)
        } 
        else
        resp.send(err.message);

    })

})
//==========delete====================
app.get("/do-delete",function(req,resp){
    let email=req.query.emailKeyKuch;
    mysqlCon.query("delete from userspro where emailid =?",[email],function(err,result){//? is called parameter
        if(err==null){
            if(result.affectedRows==1)//ik row ch data hega haii
                resp.send("Record deletes successfully");
                else
                resp.send("invalid email id");
        }
        else
        resp.send(err.message);
    })
})
//========block user===========
app.get("/do-block",function(req,resp){
    
    let email= req.query.emailKeyKuch;

     mysqlCon.query("update userspro set active=? where emailid=?",[0,email],function(err,result) 
     {
        if(err==null)
              {
                if(result.affectedRows==1)
                    resp.send("User Blocked")  ;
                else
                       resp.send("Invalid Email id")  ; 
              }
        else
                resp.send(err.message);
    })
})
//============resume user
app.get("/do-resume",function(req,resp){
    let email= req.query.emailKeyKuch;

     mysqlCon.query("update userspro set active=? where emailid=?",[1,email],function(err,result) 
     {
        if(err==null)
              {
                if(result.affectedRows==1)
                    resp.send("User Un-Blocked")  ;
                else
                       resp.send("Invalid Email id")  ; 
              }
        else
                resp.send(err.message);
    })
})
//========admin donors=========
app.get("/admindonors", function(req, resp) {
    var path=__dirname+"/public/admin-donors-dash.html";
        resp.sendFile(path);
});
app.get("/fetch-alll",function(req,resp){
    mysqlCon.query("select * from dprofiles",function(err,resultJSONAry){//show time 2nd parameter result json ary houga and delete time result
        if(err==null){
            resp.send(resultJSONAry)
        } 
        else
        resp.send(err.message);

    })

})
//==============================
app.get("/donorDash", function(req, resp) {
    var path=__dirname+"/public/dash-donor.html";
        resp.sendFile(path);
});

app.get("/fetch-medicine",function(req,resp)
{
    let email=req.query.emailidKuch;
     mysqlCon.query("select * from medecine where emailid=? ",[email],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//fetch equipment
app.get("/fetch-equipment",function(req,resp)
{
    let email=req.query.emailidKuch;
     mysqlCon.query("select * from equipments where emailid=? ",[email],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})

//==========delete====================
 app.get("/do-deletereq",function(req,resp){
    let rid=req.query.ridkuch;
    mysqlCon.query("delete from medecine where rid =?",[rid],function(err,result){//? is called parameter
        if(err==null){
            if(result.affectedRows==1)//ik row ch data hega haii
                resp.send("Record deletes successfully");
                else
                resp.send("invalid email id");
        }
        else
        resp.send(err.message);
    })
})

//delete equipment
//==========delete====================
app.get("/do-deleteeqi",function(req,resp){
    let rid=req.query.ridkuch;
    mysqlCon.query("delete from equipments where rid =?",[rid],function(err,result){//? is called parameter
        if(err==null){
            if(result.affectedRows==1)//ik row ch data hega haii
                resp.send("Record deletes successfully");
                else
                resp.send("invalid email id");
        }
        else
        resp.send(err.message);
    })
})
//update========
app.get("/update-pass",function(req,resp){
    let email= req.query.emailidKuch;
    let passOLD=req.query.passOld;
    let passNEW=req.query.passNew;

     mysqlCon.query("update userspro set pwd=? where emailid=? AND pwd=?",[passNEW,email,passOLD],function(err,result) 
     {
       if(err==null){
                if(result.affectedRows==1)
                    resp.send("Password Updated Successfully");
                else
                    resp.send("Invalid Email");
            }
            else
                resp.send(err.message);

    })
})
//======admin dasboard linking======
app.get("/adminDash", function(req, resp) {
    var path=__dirname+"/public/dash-admin.html";
        resp.sendFile(path);
});

app.get("/medAll", function(req, resp) {
    var path=__dirname+"/public/all medicines.html";
        resp.sendFile(path);
});

//=========Fetch Medicine in cards
app.get("/fetch-Allmedicine",function(req,resp)
{
     mysqlCon.query("select * from medecine ",function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
app.get("/fetch-medDetail",function(req,resp)
{
    let rid=req.query.ridKuch
     mysqlCon.query("select * from medecine where rid=? ",[rid],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})

//========medFinder linking
app.get("/Medfinder", function(req, resp) {
    var path=__dirname+"/public/medFinder.html";
        resp.sendFile(path);
});

//=====show cities
app.get("/Show-Cities",function(req,resp)
{
     mysqlCon.query("select distinct city from dprofiles ",function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})


//=======inner joining====== 

app.get("/show-MedByCity",function(req,resp)
{
    let city=req.query.city;
     mysqlCon.query("select  distinct m.medname from dprofiles p inner join medecine m on p.emailid=m.emailid where p.city=? ",[city], function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//=====button click te cards show hon===== 
app.get("/show-selMed",function(req,resp)
{
      
    let med=req.query.medicine;
    let city=req.query.city;

     mysqlCon.query("SELECT * FROM dprofiles p INNER JOIN medecine m ON p.emailid = m.emailid WHERE p.city=? AND m.medname=?", [city,med],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//donor======
app.get("/show-donor",function(req,resp)
{

    let email=req.query.email;


     mysqlCon.query("select * from dprofiles where emailid=? ",[email],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})

//======ngo reg linking=====
app.get("/ngoreg", function(req, resp) {
    var path=__dirname+"/public/ngo-registration.html";
        resp.sendFile(path);
});

 //=========for registration now send to server ================
    //=============ngo-registration===================
    app.post("/ngo-data",async function(req,resp){
    
    
        //File uploading
        let msg="File Not Uploaded";
        let myUrl="nopic.jpg";
    
    
        if(req.files!=null)
        {
            let fileName=req.files.regproof.name;//uploaded files goes in file object 
            let fullPath=__dirname+"/uploads/"+fileName;
            await req.files.regproof.mv(fullPath);//saving pic in upload folder
            msg="uploaded Successfully";   
    
            await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
            {
                myUrl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log("************")
                console.log(myUrl);
            })
        }
        
        let emailid=req.body.inputEmail;
        let ngo=req.body.inputNgoName;
        let regoffice=req.body.inputRegOff;
        let city=req.body.inputCity;
        let website=req.body.inputWeb
        let contactno=req.body.inputConNo;
        let since=req.body.inputSince;
        let chairperson=req.body.inputChair;
        let ngoworks=req.body.inputWork;
        let regnumber=req.body.inputRegNo;
        
        
    
    
        mysqlCon.query("insert into ngoss values(?,?,?,?,?,?,?,?,?,?,?)",[emailid,ngo,regoffice,city,website,contactno,since,chairperson,ngoworks,regnumber,myUrl],function(err){
                
            if(err==null){
                resp.sendFile(__dirname+"/public/response.html");
            
               // resp.send("Badhaii!!!! Record Saved Successfully");
            }
            else
                resp.send(err.message);
        })
    
    })
    
    //========eqpFinder linking
app.get("/Equipfinder", function(req, resp) {
    var path=__dirname+"/public/equip-finder.html";
        resp.sendFile(path);
});

//=====show cities
app.get("/Show-Cities",function(req,resp)
{
     mysqlCon.query("select distinct city from dprofiles ",function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//=======inner joining====== 

app.get("/show-EquipByCity",function(req,resp)
{
    let city=req.query.city;
     mysqlCon.query("select  distinct e.equipment from dprofiles p inner join equipments e on p.emailid=e.emailid where p.city=? ",[city], function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})

//=====button click te cards show hon===== 
app.get("/Show-seleqp",function(req,resp)
{
      
    let eqp=req.query.equipment;
    let city=req.query.city;

     mysqlCon.query("SELECT * FROM dprofiles p INNER JOIN equipments e ON p.emailid = e.emailid WHERE p.city=? AND e.equipment=?", [city,eqp],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//donor======
app.get("/show-donor",function(req,resp)
{

    let email=req.query.email;


     mysqlCon.query("select * from dprofiles where emailid=? ",[email],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//====ngo finder linking====

    
    app.get("/ngofind", function(req, resp) {
        var path=__dirname+"/public/ngo-finder.html";
            resp.sendFile(path);
    });
    app.get("/fetch-cities",function(req,resp)
{

     mysqlCon.query("select distinct city from dprofiles ",function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
app.get("/show-ngo",function(req,resp)
{

    let city=req.query.city;
     mysqlCon.query("select * from ngoss where city=? ",[city],function(err,resultJSONAry) {
        if(err==null)
              {
                console.log(resultJSONAry)
                resp.send(resultJSONAry)
                
              }
        else
                resp.send(err.message);
    })
})
//needy profile linking
app.get("/needypro", function(req, resp) {
    var path=__dirname+"/public/needy profile.html";
        resp.sendFile(path);
});

//=====GEN_AI======

async function GetInfo(imgurl)
{
const myprompt = "Read the text on picture and tell all the information in adhaar card and give date in YYYY-MM-DD and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: '',address: ''}. Dont give output as string."   
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData
}
app.post("/needy-data",async function(req,resp)
{
    let jsonResultFromAi;
     let msg="File not Uploaded";
    let myUrl="nopic.jpg";
    if(req.files!=null)
    {
        let fileName=req.files.adharfront.name;
        let fullPath=__dirname+"/uploads/"+fileName;
        await req.files.adharfront.mv(fullPath);
        msg="Uploaded Successfully";

       await cloudinary.uploader.upload(fullPath).then(async function(picUrlResult)
        {
            myUrl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("****")
            console.log(myUrl);
             jsonResultFromAi=await GetInfo(myUrl);
             console.log(jsonResultFromAi);
            //resp.send(jsonResultFromAi);

      });

    }
    let jsonResultFromAi2;
    let msg2="File not Uploaded";
   let myUrl2="nopic.jpg";
   if(req.files!=null)
   {
       let fileName=req.files.adharrear.name;
       let fullPath=__dirname+"/uploads/"+fileName;
       await req.files.adharrear.mv(fullPath);
       msg2="Uploaded Successfully";

      await cloudinary.uploader.upload(fullPath).then(async function(picUrlResult)
       {
           myUrl2=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
           console.log("****")
           console.log(myUrl2);
            jsonResultFromAi2=await GetInfo(myUrl2);
            console.log(jsonResultFromAi2);
           //resp.send(jsonResultFromAi);

     });

   }
   let email=req.body.inputEmail;
   let mobile=req.body.inputMobile;   
   let name=jsonResultFromAi.name;
   let acardno=jsonResultFromAi.adhaar_number;
   let address=jsonResultFromAi2.address;
   let gender=jsonResultFromAi.gender;
   let dob=jsonResultFromAi.dob;
   //write query to save record

    mysqlCon.query("insert into needys values(?,?,?,?,?,?,?,?,?)",[email,mobile,myUrl,myUrl2,name,acardno,address,gender,dob],function(err){
               
           if(err==null){
               resp.sendFile(__dirname+"/public/response.html");
           }
           else
               resp.send(err.message);
       })
   

})
//ngo dash linking========

app.get("/ngoDash", function(req, resp) {
    var path=__dirname+"/public/dash-ngo.html";
        resp.sendFile(path);
});

//needy dash linking========

app.get("/needydash", function(req, resp) {
    var path=__dirname+"/public/needy-dash.html";
        resp.sendFile(path);
});

   

    














    








