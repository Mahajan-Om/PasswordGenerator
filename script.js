const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMSG]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#symbols");
const indicator =document.querySelector("[data-indicator]");
const generateBtn =document.querySelector(".generatorButton");
const allCheckBox =document.querySelectorAll("input[type=checkbox]");

// Generate Random Letters and Number and Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;

handleslider();

//set strength button clor to greyish

setindicator("#ccc");

function handleslider(){  // hnadlesslider ka kaam sirf itna hai ki passwordLength ko ui pe display krwataa hai
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
      ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndInt(min, max){
    return Math.floor(Math.random() * (max-min))+min;  // math.random 0 se 1 ke bich me random int dega ab usko max-min se mult kiya to 0 se max-min tk ki range aa gyi ab ye float number bhi ho sakta hia to usko Math.floor se multiply kiya , ab plus min krne se uski range min se lekar max tk aa jayegi
}

function getRandomNumber(){
    return getRndInt(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRndInt(97,123));
}

function getUpperCase(){
    return String.fromCharCode(getRndInt(65,91));
}

// Generate Symbol 
function generateRandomSymbol() {
    let index = getRndInt(0, symbol.length);
    return symbol[index];
};

function checkstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numbercheck.checked) hasNumber = true;
    if (symbolcheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setindicator("#0f0");  //chaged color
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setindicator("#ff0");
    } else {
        setindicator("#f00");
    }
};

// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// Shuffle the array randomly - Fisher Yates Method
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // math.random 0 se 1 value dega ab usko i+1 se mul kiya to range 1 se i+1 tk rahegi aur 1 iclusive and i+1 exclusive
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
};

async function copyContent() {  // async use kiya becz await bina async work nhi krta ab password.value clipboard me copy using navigator. wali method jo ki ek promise return krta hai ab promise agr resolve hua to usko try me dal dia ab wo password.value copy kr dega but agr error aaya i.e reject to failed message copy ho jayega 

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied!';
    }
    catch(e){

        copyMsg.innerText='failed!';
    }
    // to make copy wala span visible
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

inputSlider.addEventListener('input', (event) => {  // jese hi slider ki value /bar chanege hoga weve hi passwordlenght me event.target.value aa jayegi 
    passwordLength = event.target.value;
    handleslider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value)
        copyContent();
});

//ab generate password pe click kiya but sare checkbox unchecked hai to password generate nhi hoga atleast one checkbox sholud be cjecked so checkcount ka use karenge but wo to const hai starting me isliye checkboxes pe bhi eventlistner lagaana padega taki copycount update ho sake aur hume malum pd sake ki kitne boxes check hai 
    
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {   // password ki length one hai aur 4 check boxes chrcked hai to 4 word ka hi password banega 
        passwordLength = checkCount;
        handleslider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})   // har ek checkbox ko check kiya ab usme change aaya i.e checked or unchecked both to nya function call kiya uprwala jisme sare checkbox phirse count krliye aur agr koi checkbox checked hai checkcount ko increment kr diya 


generateBtn.addEventListener('click', () => {
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleslider();
    }

    // Remove Previous Password 
    password = "";

    let arrayOfCheckedFunction = [];

    if (uppercasecheck.checked) arrayOfCheckedFunction.push(getUpperCase);
    if (lowercasecheck.checked) arrayOfCheckedFunction.push(getLowerCase);
    if (numbercheck.checked) arrayOfCheckedFunction.push(getRandomNumber);
    if (symbolcheck.checked) arrayOfCheckedFunction.push(generateRandomSymbol);

    // Compulsory Addition
    for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
        password += arrayOfCheckedFunction[i]();
    }

    // console.log("Password: " + password);

    // Additional addition
    for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
        let randIndex = getRndInt(0, arrayOfCheckedFunction.length);
        password += arrayOfCheckedFunction[randIndex]();
    }
    // console.log("Password: " + password);

        // Shuffle Password 
        password = shuffle(Array.from(password));
        passwordDisplay.value = password;

        checkstrength();
});