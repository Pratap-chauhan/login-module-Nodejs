const ResponseSend = require('../Boom/response.js')
const message = require('../Boom').errorMessage.eng
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {OAuth2Client} = require('google-auth-library');
module.exports={
    
checkMail: async (mail)=>{
    try{
        let a = await new Promise((resolve,reject)=>{
            connection.query(`SELECT * from user WHERE email=?`,[mail],(err,res)=>{
            if(err)
            return reject(err)
            else{
            return resolve(res);
             } })
        });
        
        return (a[0]) 
    }
    catch(err){
        return ResponseSend.sendError(err);
    }
},


checkPassword: async (body,password)=>{
    try{
        let a = bcrypt.compareSync(password,body.password);
        return a
    }
    catch(err){
        return ResponseSend.sendError(err);
    }
},

checkNumber: async (body)=>{
    try{
        let a = await new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM user WHERE phoneNumber = ?`,[body.phoneNumber],(err,res)=>{
            if(err)
            return reject(err)
            else{
            return resolve(res);
             } })
        });
        
        return a[0]
    }
    catch(err){
        return ResponseSend.sendError(err);
    }
},

addData: async (data)=>{
    let password = data.password;
            
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            
            data.password = hash;
            
            let dat = await connection.query(`INSERT INTO user SET ?`, data)
                
            return dat.values
  },


  socialsignin : async(token)=>{
    
    const CLIENT_ID = '894829491932-c10ip6fk723v40vfb8ispg21j7dige0t.apps.googleusercontent.com;'
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
    }
    return verify().catch(console.error);
  }
}