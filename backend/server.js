const express = require("express")
const app = express()
const path = require("path")


app.set("views",path.join(__dirname,"../frontend/public"))
app.set("view engine","ejs")

app.use(express.static(path.join(__dirname,"../frontend/public")))

app.get("/",(req,res)=>{
    console.log("here")
    // res.send("hello")
    //res.download("server.js")
   // res.json({message:"error"})
   res.render("index")
})

const {Client} = require("pg")

const client = new Client({
    host: "localhost",
    user:"postgres",
    port:5433,
    password:"bazepodataka",
    database:"Hoteli"
})

client.connect();



app.get("/datatable",(req,res)=>{
    
    client.query("select h.id,ime_hotela,ulica,kucni_broj,postanski_broj,grad,drzava,broj_osoba,cijena,brojzvjezdica,telefon,email,s.id as soba_id from hotel h join sobe s on h.id=s.hotel_id",
        (err,dbRes)=>{
        if(!err){
            res.render("datatable",{rooms:dbRes.rows})
        }
        else {
            console.log(err.message)
        }
        client.end;
    })

})

app.listen(3000)
