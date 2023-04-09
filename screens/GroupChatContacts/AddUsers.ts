import { db } from "../../firebase";
const AddUsers = (props)=>{
props.map((user)=>{
    try {
        try{
        db.collection("groups")
        .doc(user.phoneNumber)
        .set({
            phoneNumber:user.phoneNumber,
            photoURL:"https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fprofile.png?alt=media&token=8e12f5b1-9ddd-4e00-9fed-f057f0bef499",
            displayName:""
        })
        }
        catch(err){
            console.log(err);
        }
      db.collection("groups")
        .doc("0F9jEC0umqs91DR81afH")
        .set(user)
    } catch (err) {
        console.log(err)
    }
    alert("successfull");
})}

export default AddUsers;