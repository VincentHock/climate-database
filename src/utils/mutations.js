import { doc, deleteDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { db } from './firebase';


// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
   });
}

export async function updateEntry(entry) {
   const currentRef = doc(db, "entries", entry.id)
   await updateDoc(currentRef, {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      category: entry.category,
   });
}

export async function deleteEntry(entry) {
   await deleteDoc(doc(db, "entries", entry));
}

// Attempt at making a search bar: Explanation in interview

// export function filterSearch(entry) {
//    const emptyEntry = [];
//    const search = "";
//    if (search === "") {
//       return entry;
//    } else {
//       for (let i = 0; i < entry.length; i++) {
//          let currentEntry = entry[i].name.toUpperCase();
//          if (currentEntry.includes(search.toUpperCase())) {
//            emptyEntry.append(entry[i]);
//          }}
//       return emptyEntry;
//    };
// }
