import {getSprintAssignments}  from "../auth/confirm/apiConstant"


export default async function FetchCurrentSprint()  {
    const response = await fetch(getSprintAssignments);
    if (!response.ok) throw Error("Unable To Get Current Sprint...");
    


// let { data, error } = await supabase
//   .rpc('get_assignments', {
//         userid
//     })
//     if (error) console.error(error)
//     else console.log(data)
// return response.json();
// };