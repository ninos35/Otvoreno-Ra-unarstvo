const express = require("express");
const { auth } = require("express-openid-connect");
const session = require("express-session");
const path = require("path");

const app = express();

// Auth0 konfiguracija
const config = {
  authRequired: false, 
  auth0Logout: true,
  secret: "SN0PVtX24Kb_2nrZUtUeGPxFtEDfynaBDpYUxe_iPhWebGo5Ed6efFzVIKCAKEai",
  baseURL: "http://localhost:3000",
  clientID: "nILVl2ryHpW6sKSmT5bl73srUVJlsEtv",
  issuerBaseURL: "https://dev-c064jugao1g4cdru.us.auth0.com",
  
};


app.use(auth(config));


app.use(express.static(path.join(__dirname, "../frontend/public")));



const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433,
    password: "bazepodataka",
    database: "Hoteli",
});

client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});



app.use(
    session({
      secret: "SN0PVtX24Kb_2nrZUtUeGPxFtEDfynaBDpYUxe_iPhWebGo5Ed6efFzVIKCAKEai", 
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true, 
        secure: true, 
        sameSite: "None", 
        maxAge: 3600000, // 1h
      },
    })
  );

app.use((req,res,next)=>{
    res.locals.user=req.user || null;
    next();
})



app.get("/", (req, res) => {
 
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});




app.get("/login", (req, res) => {

    

    res.oidc.login();
});


app.get("/logout", (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.status(401).send("Greška! Nisi prijavljen, pa se ne možeš ni odjaviti");
      }
   
  res.oidc.logout();
});


app.get("/profile", (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send("Greška! Nisi prijavljen");
  }
  res.json(req.oidc.user);
  
});

app.get("/refresh", (req, res) => {

    if (!req.oidc.isAuthenticated()) {
        return res.status(401).send("Greška! Nisi prijavljen");
      }

    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, brojzvjezdica, telefon, email FROM hotel h ",
        (err, dbRes) => {
            if (!err) {
                res.status(200).json(respWrapper("success", "Hoteli", dbRes.rows));
            } else {
                console.log(err.message);
                res.status(404).json(respWrapper("error", "Hoteli nisu nađeni"));
            }
        }
    );
});


  
// omotač za statuse
const respWrapper = (status, message, data = null) => {
    return { status, message, data };
};

app.get("/hoteli", (req, res) => {
    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, brojzvjezdica, telefon, email FROM hotel h ",
        (err, dbRes) => {
            if (!err) {
                res.status(200).json(respWrapper("success", "Lista hotela", dbRes.rows));
            } else {
                console.log(err.message);
                res.status(404).json(respWrapper("error", "Hoteli nisu nađeni"));
            }
        }
    );
});

app.get("/hoteli/:id", (req, res) => {
    const hotelId = req.params.id;

    if (isNaN(hotelId)) {
        return res.status(400).json(respWrapper("error", "ID mora biti broj"));
    }

    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, brojzvjezdica, telefon, email FROM hotel h  WHERE h.id = $1",
        [hotelId],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri dohvaćanju podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Hotel nije nađen"));
            }

            return res.status(200).json(respWrapper("success", "Podaci o hotelu", dbRes.rows));
        }
    );
});

app.post("/hoteli/:id", (req, res) => {
    const hotelId = req.params.id;
    const { imehotela, ulica, kucnibroj, grad, drzava, brojzvjezdica, telefon, email, postanski_broj } = req.body;

    if (isNaN(hotelId)) {
        return res.status(400).json(respWrapper("error", "ID mora biti broj"));
    }

    if (!imehotela || !ulica || !kucnibroj || !grad || !drzava || !brojzvjezdica || !telefon || !email) {
        return res.status(400).json(respWrapper("error", "Svi podaci su obavezni"));
    }

    const values = [ imehotela, ulica, kucnibroj, postanski_broj , grad, drzava, brojzvjezdica, telefon, email ];

    client.query(
        "INSERT INTO hotel (id,ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, brojzvjezdica, telefon, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [hotelId,...values],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri unosu podataka"));
            }

            return res.status(200).json(respWrapper("success", "Dodavanje je uspješno", dbRes.rows[0]));
        }
    );
});

app.put("/hoteli/:id", (req, res) => {
    const hotelId = req.params.id;
    const { imehotela, ulica, kucnibroj, postanskiBroj , grad, drzava, brojzvjezdica, telefon, email } = req.body;

    if (isNaN(hotelId)) {
        return res.status(400).json(respWrapper("error", "ID mora biti broj"));
    }

    if (!imehotela || !ulica || !kucnibroj || !postanskiBroj || !grad || !drzava || !brojzvjezdica || !telefon || !email) {
        return res.status(400).json(respWrapper("error", "Svi podaci su obavezni"));
    }

    client.query(
        "UPDATE hotel SET ime_hotela = $1, ulica= $2, kucni_broj= $3, postanski_broj= $4, grad= $5, drzava= $6, brojzvjezdica= $7, telefon= $8, email= $9 WHERE id = $10 RETURNING *",
        [imehotela, ulica, kucnibroj, postanskiBroj , grad, drzava, brojzvjezdica, telefon, email,hotelId],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri unosu podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Hotel nije nađen"));
            }

            return res.status(200).json(respWrapper("success", "Ažuriranje je uspješno", dbRes.rows[0]));
        }
    );
});


app.delete("/hoteli/:id", (req, res) => {
    const hotelId = req.params.id;

    if (isNaN(hotelId)) {
        return res.status(400).json(respWrapper("error", "ID mora biti broj"));
    }


    client.query(
        "DELETE from hotel where id = $1 RETURNING *",
        [hotelId],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri unosu podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Hotel nije nađen"));
            }

            return res.status(200).json(respWrapper("success", "Brisanje je uspješno", dbRes.rows[0]));
        }
    );
});


app.get("/hoteli/grad/:grad", (req, res) => {
    const gradHotela = req.params.grad;

    if (typeof gradHotela !== 'string' || !isNaN(gradHotela)) {
        return res.status(400).json(respWrapper("error", "Grad mora biti tipa String"));
    }

    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, broj_osoba, cijena, brojzvjezdica, telefon, email, s.id as soba_id FROM hotel h JOIN sobe s ON h.id=s.hotel_id WHERE h.grad = $1",
        [gradHotela],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri dohvaćanju podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Nema hotela u tom gradu"));
            }

            return res.status(200).json(respWrapper("success", "Lista hotela po gradu", dbRes.rows));
        }
    );
});

app.get("/hoteli/zvjezdice/:brojZvjezdica", (req, res) => {
    const brojZ = req.params.brojZvjezdica;

    if (isNaN(brojZ) || brojZ < 1 || brojZ > 5) {
        return res.status(400).json(respWrapper("error", "Neispravno unesen broj zvjezdica"));
    }

    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, broj_osoba, cijena, brojzvjezdica, telefon, email, s.id as soba_id FROM hotel h JOIN sobe s ON h.id=s.hotel_id WHERE h.brojzvjezdica = $1",
        [brojZ],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri dohvaćanju podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Nema hotela sa zadanim brojem zvjezdica"));
            }

            return res.status(200).json(respWrapper("success", "Lista hotela sa zadanim brojem zvjezdica", dbRes.rows));
        }
    );
});

app.get("/hoteli/postanskiBroj/:postanskiBroj", (req, res) => {
    const postBroj = req.params.postanskiBroj;

    if (isNaN(postBroj) || postBroj < 10000 || postBroj > 99999) {
        return res.status(400).json(respWrapper("error", "Neispravno unesen poštanski broj"));
    }

    client.query(
        "SELECT h.id, ime_hotela, ulica, kucni_broj, postanski_broj, grad, drzava, broj_osoba, cijena, brojzvjezdica, telefon, email, s.id as soba_id FROM hotel h JOIN sobe s ON h.id=s.hotel_id WHERE h.postanski_broj = $1",
        [postBroj],
        (err, dbRes) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(respWrapper("error", "Greška pri dohvaćanju podataka"));
            }

            if (dbRes.rowCount === 0) {
                return res.status(404).json(respWrapper("error", "Nema hotela na tom poštanskom broju"));
            }

            return res.status(200).json(respWrapper("success", "Lista hotela na određenom poštanskom broju", dbRes.rows));
        }
    );
});

app.all("*",(req,res)=>{
    return res.status(501).json(respWrapper("Not Implemented","Method not implemented for requested resource",null))
})


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
