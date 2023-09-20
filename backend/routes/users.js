


const express = require("express");
const router =  new express.Router();
const db = require("../db");



router.get("/",  async (req,res,next) =>{

  try{
    const results =  await db.query(`SELECT * FROM users`);
    return res.json(results.rows);

  }catch(e){
    return next(e);
  }
})


router.get("/:id",  async (req,res,next)=>{
    try{
        const id =  req.params.id;
        const results = await db.query(`SELECT * FROM users WHERE userid =$1`, [id])
        return res.json(results.rows)

    }catch(e){
        return next(e)
    }
})
 
router.post("/", async (req, res, next) => {
  try {
    const { username, firstName, lastName, email, password, location, contact } = req.body;
    const results = await db.query(
      "INSERT INTO users (username, firstName, lastName, email, password, location, contact) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [username, firstName, lastName,email, password, location, contact]
    );
    return res.json(results.rows);
  } catch (e) {
    return next(e);
  }
});

router.patch("/:id", async (req,res,next)=>{

   try{
     
    const id = req.params.id;
    const {username, firstName, lastName} = req.body;
    const results = await db.query('UPDATE users SET username=$1, firstName=$2, lastName=$3 WHERE userid=$4 RETURNING userid, firstName, lastName', [username,firstName,lastName,id]);
    return res.send(results.rows[0]);
   
    }  catch(e){
        return next(e);
   }

})

router.delete("/:id", async (req, res, next) => {
  try {
      const results = await db.query("DELETE FROM users WHERE userid = $1", [req.params.id]);
      return res.send({ msg: "DELETED" });
  } catch (e) {
      return next(e);
  }
});


module.exports = router; 