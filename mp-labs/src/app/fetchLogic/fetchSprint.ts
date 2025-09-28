import {getSprintAssignments}  from "../auth/confirm/apiConstant"
type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};

export default async function FetchCurrentSprint()  {
    const response = await fetch(getSprintAssignments);
    if (!response.ok) throw Error("Unable To Get Current Sprint...");
    
    const data : Assignment[] = await response.json();
    return data;
}
    


// let { data, error } = await supabase
//   .rpc('get_assignments', {
//         userid
//     })
//     if (error) console.error(error)
//     else console.log(data)
// return response.json();
// };