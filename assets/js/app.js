if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed");
        console.log(error);
    });

}
let calBtn = document.getElementById('calBtn');
let resetBtn = document.getElementById('resetBtn');

let billAmount = document.getElementById('biiAmount');
let tipPercentRadio = document.querySelectorAll('input[name="tipValue"]');
let tipLabel = document.querySelectorAll('.tip-label');
let tipValueCus = document.getElementById('tipValueCus');
let numOPeople = document.getElementById('numOPeople');
let tipAmountLabel = document.getElementById('tipAmountLabel');
let totAmountLabel = document.getElementById('totAmountLabel');

let billErrorLabel = document.getElementById('billErrorLabel');
let numOPeopleLabel = document.getElementById('numOPeopleLabel');

const tipValueGet = () => {
    for (x = 0; x < tipPercentRadio.length; x++) {
        if (tipPercentRadio[x].checked == true) {
            return tipPercentRadio[x].value;
        }
    }
    if (tipValueCus.value != "") {
        return tipValueCus.value;
    } else {
        tipValueCus.value = null;
        return 0;
    }
}

const tipValSave = () => {
    for (let t = 0; t < tipPercentRadio.length; t++) {
        if (tipPercentRadio[t].checked == true) {
            return tipPercentRadio[t].value;
        }
    }
    return 0;
};

const tipValSaveCus = () => {
    if (tipValueCus.value != "") {
        return tipValueCus.value;
    } else {
        return 0;
    }
}

const billAmountInput = () => {
    let billValue = billAmount.value;
    if (billValue == 0 || billValue == "") {
        billErrorLabel.classList.remove('d-none');
        billAmount.classList.add('warning-border');
    } else {
        billErrorLabel.classList.add('d-none');
        billAmount.classList.remove('warning-border');
    }
    return;
}

const peopleInput = () => {
    let peopleValue = numOPeople.value;
    if (peopleValue == 0 || peopleValue == "") {
        numOPeopleLabel.classList.remove('d-none');
        numOPeople.classList.add('warning-border');
    } else {
        numOPeopleLabel.classList.add('d-none');
        numOPeople.classList.remove('warning-border');
    }
    return;
}

for (let l = 0; l < tipLabel.length; l++) {
    tipLabel[l].addEventListener("click", () => {
        tipValueCus.value = null;
    });
};

tipValueCus.addEventListener("focus", () => {
    for (a = 0; a < tipPercentRadio.length; a++) {
        tipPercentRadio[a].checked = false;
    }
});

billAmount.addEventListener("focusout", () => {
    let billValue = billAmount.value;
    if (billValue != 0 || billValue != "") {
        billErrorLabel.classList.add('d-none');
        billAmount.classList.remove('warning-border');
    }
});

numOPeople.addEventListener("focusout", () => {
    let peopleValue = numOPeople.value;
    if (peopleValue != 0 || peopleValue != "") {
        numOPeopleLabel.classList.add('d-none');
        numOPeople.classList.remove('warning-border');
    }
});


class DataSaveSet {
    constructor(bill, people, tipP, tipT, ...tipList) {
        this.bill = bill;
        this.people = people;
        this.tipP = tipP;
        this.tipT = tipT;
        this.tipList = new TipList(...tipList);
    }
}

class TipList {
    constructor(tipVal, tipCVal) {
        this.tipVal = tipVal;
        this.tipCVal = tipCVal;
    }
}

window.addEventListener("load", () => {
    try {
        let getDataOut = JSON.parse(localStorage.getItem('dataObj'));
        billAmount.value = getDataOut.bill;
        numOPeople.value = getDataOut.people;
        tipAmountLabel.innerHTML = getDataOut.tipP;
        totAmountLabel.innerHTML = getDataOut.tipT;
        let tipPerOutF = parseInt(getDataOut.tipList.tipVal);
        let tipPerOutC = parseFloat(getDataOut.tipList.tipCVal);
        // console.log(getDataOut);
        // console.log(tipPerOutF, tipPerOutC);
        if (tipPerOutF != 0) {
            for (a = 0; a < tipPercentRadio.length; a++) {
                if (tipPercentRadio[a].value == tipPerOutF) {
                    tipPercentRadio[a].checked = true;
                }
            }
        }
        if (tipPerOutC != 0) {
            tipValueCus.value = tipPerOutC;
        } else {
            tipValueCus.value = null;
        }
    } catch (error) {
        console.log(error);
    }
});



const tipCalculation = () => {
    let billValue = billAmount.value;
    let peopleValue = numOPeople.value;
    tipPer = parseInt(tipValueGet());
    tipF = tipValSave();
    tipC = tipValSaveCus();
    if ((billValue == 0 || billValue == "") || (peopleValue == 0 || peopleValue == "")) {
        billAmountInput();
        peopleInput();
        console.log("Error");
    } else {
        let tipAmountOut = ((billValue / 100) * tipPer);
        let tipAPerson = (tipAmountOut / peopleValue);
        let totPerson = ((billValue / peopleValue) + tipAPerson);
        tipAmountLabel.innerHTML = tipAPerson.toFixed(2);
        totAmountLabel.innerHTML = totPerson.toFixed(2);
        let calTempData = new DataSaveSet(billValue, peopleValue, tipAPerson.toFixed(2), totPerson.toFixed(2), tipF, tipC);
        localStorage.setItem("dataObj", JSON.stringify(calTempData));

    }
};

const resetAll = () => {
    billAmount.value = null;
    billAmount.autofocus = focus();
    for (a = 0; a < tipPercentRadio.length; a++) {
        tipPercentRadio[a].checked = false;
    }
    tipValueCus.value = null;
    numOPeople.value = null;
    billErrorLabel.classList.add('d-none');
    billAmount.classList.remove('warning-border');
    numOPeopleLabel.classList.add('d-none');
    numOPeople.classList.remove('warning-border');
    tipAmountLabel.innerHTML = "0.00";
    totAmountLabel.innerHTML = "0.00";
    tipF = tipValSave();
    tipC = tipValSaveCus();
    let calTempData = new DataSaveSet(null, null, "0.00", "0.00", tipF, tipC);
    localStorage.setItem("dataObj", JSON.stringify(calTempData));
}

calBtn.addEventListener("click", tipCalculation);
resetBtn.addEventListener("click", resetAll);
// Keyboard Function
document.body.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        tipCalculation();
        billAmountInput();
        peopleInput();
        calBtn.classList.add('btn-cal-bg');
    }
    if (event.key == "Escape") {
        event.preventDefault();
        resetAll();
        resetBtn.classList.add('btn-reset-bg');
    }
});
document.body.addEventListener("keyup", (kev) => {
    if (kev.key == "Enter") {
        kev.preventDefault();
        calBtn.classList.remove('btn-cal-bg');
    }
    if (kev.key == "Escape") {
        kev.preventDefault();
        resetBtn.classList.remove('btn-reset-bg');
    }
});
