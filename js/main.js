// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
    getFirestore,
    getDocs,
    addDoc,
    onSnapshot,
    doc,
    getDoc,
    query,
    where,
    updateDoc,
    deleteDoc,
    collection
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyDnlRRdgpOE74maHVoRc_bTqOzLJmHlzWg",
    authDomain: "lab1firbase.firebaseapp.com",
    databaseURL: "https://lab1firbase-default-rtdb.firebaseio.com",
    projectId: "lab1firbase",
    storageBucket: "lab1firbase.appspot.com",
    messagingSenderId: "182094761903",
    appId: "1:182094761903:web:036778a854742c1e7ca95a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// The parent of a root reference is null
const firestore = getFirestore(app);
const auth = getAuth(app);
/*
onAuthStateChanged(auth, (user) => {
    if (user) {

        const uid = user.uid;
        document.querySelector("#username").innerHTML = `${user.email}`;
        // ...
    } else {
        location.replace("/form.html");
    }
});
document.querySelector("#username").addEventListener('click', () => {
    signOut(auth);
});
*/
let aval = false;
let courseName = document.querySelector("#courseName");
let finalMark = document.querySelector("#finalMark");
let hours = document.querySelector("#hours");
let avaliable = document.querySelector("#avaliable");
avaliable.addEventListener('change', function () {
    aval = !aval;
});
let alertInfo = document.querySelector(".alert-info");
let alertInfoMessage = document.querySelector(".alert-info > span");
let validationAlert = document.querySelector(".validation-alert");
let validationSmallTags = document.querySelectorAll(".form-group > input + small");
let inputFormTags = document.querySelectorAll(".form-group > input");
let inputFieldsValidationStatus = { courseName: false, finalMark: false, hours: false };
let cId = document.querySelector("#id");
let btn = document.querySelector("#save-update");
btn.addEventListener('click', saveCourseData,false);



function showAlertInfo(message) {
    alertInfoMessage.innerHTML = message;
    alertInfo.classList.add("alert-info-visiable");
    setTimeout(() => {
        alertInfo.classList.remove("alert-info-visiable");
    }, 1000);

}
async function saveCourseData() {
    if (inputFieldsValidationStatus.courseName && inputFieldsValidationStatus.finalMark && inputFieldsValidationStatus.hours) {
        const courseObj = {
            "name": courseName.value,
            "finalMark": parseFloat(finalMark.value),
            "hours": parseFloat(hours.value),
            "avaliable": Boolean(aval)

        }
        if (cId.value == "") {
            try {
                const docRef = addDoc(collection(firestore, "course"), courseObj);
                showAlertInfo(`${courseObj.name} course added successfully`);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        } else {
            try {
                let result = await updateDoc(doc(firestore, 'course', cId.value), courseObj);
                showAlertInfo(`course updated successfully`);
            } catch (e) {
                console.log(e.message);
            }

        }
        resetAllFields();
        btn.innerHTML = "Add";
    } else {
        checkValidationForAllInputs();
    }
}
function resetAllFields() {
    courseName.value = "";
    finalMark.value = "";
    hours.value = "";
    aval = false;
    avaliable.removeAttribute("checked");
}
let backdrop = document.querySelector(".back-drop");
let deleteBtn = document.querySelector(".warning-alert > button:nth-of-type(1)");
let cancelBtn = document.querySelector(".warning-alert > button:nth-of-type(2)");

onSnapshot(collection(firestore, 'course'), (snapshot) => {
    document.querySelectorAll("tbody > tr").forEach((tr) => {
        tr.remove();
    });
    for (let item of snapshot.docs) {
        let obji = item.data();
        let tableRow = document.createElement("tr");
        let courseNameTd = document.createElement("td");
        courseNameTd.innerHTML = `${obji.name}`;
        let finalMarkTd = document.createElement("td");
        finalMarkTd.innerHTML = `${obji.finalMark}`;
        let hoursTd = document.createElement("td");
        hoursTd.innerHTML = `${obji.hours}`;
        let avaliableTd = document.createElement("td");
        avaliableTd.innerHTML = `${obji.avaliable}`;
        let buttonUpdateTd = document.createElement("td");
        let updateBtnTd = document.createElement("button");
        updateBtnTd.className = "btn btn-success";
        updateBtnTd.type = "button";
        updateBtnTd.innerHTML = "update";
        updateBtnTd.addEventListener('click', () => {
            updateCourse(item.id);
        },false);
        buttonUpdateTd.append(updateBtnTd);
        let buttonDeleteTd = document.createElement("td");
        let deleteBtnTd = document.createElement("button");
        deleteBtnTd.className = "btn btn-danger";
        deleteBtnTd.type = "button";
        deleteBtnTd.innerHTML = "delete";
        deleteBtnTd.addEventListener('click', () => {
            backdrop.classList.add("show-back-drop");
            document.body.style = "overflow:hidden";
            deleteBtn.addEventListener('click',function confirmDelete(){
                backdrop.classList.remove("show-back-drop");
                document.body.style = "overflow:auto";
                deleteCourse(item.id);
            });
        });
        buttonDeleteTd.append(deleteBtnTd);
        tableRow.append(courseNameTd, finalMarkTd, hoursTd, avaliableTd, buttonUpdateTd, buttonDeleteTd);

        document.querySelector("tbody").append(tableRow);
    }
});


async function updateCourse(courseId) {
    btn.innerHTML = "Update";
     inputFieldsValidationStatus = { courseName: true, finalMark: true, hours: true };
    let resultQuery = await getDoc(doc(firestore, 'course', courseId));
    let data = resultQuery.data();
    cId.value = courseId;
    courseName.value = data.name;
    finalMark.value = data.finalMark;
    hours.value = data.hours;
    if (data.avaliable == true) {
        avaliable.setAttribute("checked", true);
        aval = true;

    } else {
        avaliable.removeAttribute("checked");
        aval = false;
    }
}
function cancelDelete(){
    backdrop.classList.remove("show-back-drop");
    document.body.style = "overflow:auto";
}
cancelBtn.addEventListener('click',cancelDelete);
async function deleteCourse(courseId) {
    try {
        let result = await deleteDoc(doc(firestore, 'course', courseId));
        showAlertInfo(`course deleted successfully`);
    } catch (e) {
        console.log(e.message);
    }

}

let queryField = document.querySelector("#filed");
let queryoperation = document.querySelector("#operation");
let queryValue = document.querySelector("#value");
let testQueryBtn = document.querySelector("#testQuery");
let oprationValue = "==";

queryField.addEventListener('change', (event) => {
    if (event.target.value === "name" || event.target.value === "avaliable") {
        queryoperation.selectedIndex = 1;
        queryoperation.setAttribute("disabled", true);
        queryoperation.style.cssText = `cursor:not-allowed;`;
    } else {
        queryoperation.selectedIndex = 0;
        queryoperation.removeAttribute("disabled");
        queryoperation.style.cssText = `cursor:pointer;`;
    }
})
queryoperation.addEventListener('change', (event) => {
    switch (event.target.value) {
        case "equle":
            oprationValue = "==";
            break;
        case "greaterThan":
            oprationValue = ">";
            break;
        case "greaterThanOrEqule":
            oprationValue = ">=";
            break;
        case "lessThan":
            oprationValue = "<";
            break;
        case "lessThanOrEqule":
            oprationValue = "<=";
            break;
        default: oprationValue = "==";
    }
});
function isNumber(userFiltarationValue) {
    return (typeof parseFloat(userFiltarationValue) === 'number' && !isNaN(parseFloat(userFiltarationValue)))
}
async function testQuery() {
    let queryFiltarationValue = queryValue.value;
    if (isNumber(queryFiltarationValue) === true)
        queryFiltarationValue = parseFloat(queryFiltarationValue);
        if(queryField.value === "avaliable"){
            if(queryFiltarationValue.toLowerCase() == "true")
            queryFiltarationValue = true;
            else queryFiltarationValue = false;
        }

    let q = query(collection(firestore, "course"), where(queryField.value, oprationValue, queryFiltarationValue));
    let queryResult = await getDocs(q);
    document.querySelectorAll("tbody > tr").forEach((tr) => {
        tr.remove();
    });
    queryResult.forEach((items) => {
        console.log(items.id);
        let tableRow = document.createElement("tr");
        let courseNameTd = document.createElement("td");
        courseNameTd.innerHTML = `${items.data().name}`;
        let finalMarkTd = document.createElement("td");
        finalMarkTd.innerHTML = `${items.data().finalMark}`;
        let hoursTd = document.createElement("td");
        hoursTd.innerHTML = `${items.data().hours}`;
        let avaliableTd = document.createElement("td");
        avaliableTd.innerHTML = `${items.data().avaliable}`;
        let buttonUpdateTd = document.createElement("td");
        let updateBtnTd = document.createElement("button");
        updateBtnTd.className = "btn btn-success";
        updateBtnTd.innerHTML = "update";
        updateBtnTd.addEventListener('click', () => {
            updateCourse(items.id);
        });
        buttonUpdateTd.appendChild(updateBtnTd);
        let buttonDeleteTd = document.createElement("td");
        let deleteBtnTd = document.createElement("button");
        deleteBtnTd.className = "btn btn-danger";
        deleteBtnTd.innerHTML = "delete";
        deleteBtnTd.addEventListener('click', () => {
            deleteCourse(items.id);
        });
        buttonDeleteTd.appendChild(deleteBtnTd);
        tableRow.append(courseNameTd, finalMarkTd, hoursTd, avaliableTd, buttonUpdateTd, buttonDeleteTd);

        document.querySelector("tbody").append(tableRow);

        queryField.selectedIndex = 0;
        queryoperation.selectedIndex = 0;
        queryValue.value = "";

    })

}
testQueryBtn.addEventListener('click', testQuery);




// validation 
function validateAllFormFieldAccordingToSpecificEvent() {
    inputFormTags.forEach((inputTag, index) => {
        inputTag.addEventListener('blur', () => {
            if (inputTag.value == "") {
                inputTag.classList.add("is-invalid");
                validationSmallTags[index - 1].innerHTML = "required";
                inputFieldsValidationStatus[inputTag.id] = false;
            }
        });
        inputTag.addEventListener('keyup', () => {
            if (inputTag.value == "") {
                inputTag.classList.add("is-invalid");
                validationSmallTags[index - 1].innerHTML = "required";
                inputFieldsValidationStatus[inputTag.id] = false;
            } else {
                inputTag.classList.remove("is-invalid");
                validationSmallTags[index - 1].innerHTML = "";
                inputFieldsValidationStatus[inputTag.id] = true;
            }
        });
    })
}
validateAllFormFieldAccordingToSpecificEvent();
function checkValidationForAllInputs() {
    inputFormTags.forEach((inputTag, index) => {
        if (inputTag.value == "" && inputTag.getAttribute('hidden') === null) {
            inputTag.classList.add("is-invalid");
            validationSmallTags[index - 1].innerHTML = "required";
            inputFieldsValidationStatus[inputTag.id] = false;
            validationAlert.classList.add("animated-alert-move-down");
            setTimeout(() => {
                validationAlert.classList.add("animated-alert-move-up");
            }, 2000);
            setTimeout(() => {
                validationAlert.classList.remove("animated-alert-move-down");
                validationAlert.classList.remove("animated-alert-move-up");
            }, 2500)
        } else {
            inputFieldsValidationStatus[inputTag.id] = true;
        }
    })
}


