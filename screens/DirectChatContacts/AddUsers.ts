import { db } from "../../firebase";
const AddUsers = (props)=>{
props.map((user)=>{
    try {
      db.collection("groups")
        .doc("0F9jEC0umqs91DR81afH")
        .set(user)
    } catch (err) {
        console.log(err)
    }
})}

export default AddUsers;