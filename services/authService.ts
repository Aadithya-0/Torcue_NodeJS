import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
const BASE_URL='http://localhost:3001';
const SECRET_KEY='12345';
export async function registerUser(username:string,password:string){
    try{
        const res=await fetch(`${BASE_URL}/users?username=${username}`);
        const users =await res.json();
        if (users.length>0){
            throw new Error('username exists cannot register');
        }
        const hashedPassword=await bcryptjs.hash(password,10);
        const createRes=await fetch(`${BASE_URL}/users`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                id:Date.now(),
                name:username,
                username,
                password:hashedPassword
            })
        });
        if(!createRes.ok) throw new Error('Failed');
        return await createRes.json();
    }catch(error){
        throw new Error(`Failed:${String(error)}`)
    }
}
export async function loginUser(username:string,password:string){
    try{
        const res=await fetch(`${BASE_URL}/users?username=${username}`);
        const users=await res.json();
        if (users.length===0){
            throw new Error("usernot found");
        }
        const user=users[0];
        const isPasswordValid=await bcryptjs.compare(password,user.password);
        if (!isPasswordValid){
            throw new Error('invalid');
        }
        const token=jwt.sign(
            {userId:user.id,username:user.username},
            SECRET_KEY,
            {expiresIn:'1h'}
        );
        return {token,userId:user.id,username:user.username};

    }catch(error){
        throw new Error(`failed : ${String(error)}`);
    }
}
export async function verifyToken(token:string){
    try{
        return jwt.verify(token,SECRET_KEY);
    }catch(error){
        throw new Error(`invalid`);
    }
}