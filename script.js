// ===============================
// NoteLock - Password Manager
// Part 3A
// ===============================

// DOM Elements
const website = document.getElementById("website");
const username = document.getElementById("username");
const password = document.getElementById("password");

const saveBtn = document.getElementById("save");
const generateBtn = document.getElementById("generate");
const searchInput = document.getElementById("search");

const passwordContainer = document.getElementById("passwordContainer");

const totalPasswords = document.getElementById("totalPasswords");
const strongPasswords = document.getElementById("strongPasswords");
const weakPasswords = document.getElementById("weakPasswords");

const toast = document.getElementById("toast");

const togglePassword = document.getElementById("togglePassword");
const themeBtn = document.getElementById("themeBtn");

// ===============================
// Local Storage
// ===============================

let passwords =
JSON.parse(localStorage.getItem("passwords")) || [];

// ===============================
// Toast Message
// ===============================

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// ===============================
// Save Password
// ===============================

saveBtn.addEventListener("click",()=>{

    const websiteValue = website.value.trim();
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    if(
        websiteValue==="" ||
        usernameValue==="" ||
        passwordValue===""){
            showToast("Please fill all fields.");
            return;
    }

    const data={

        id:Date.now(),

        website:websiteValue,

        username:usernameValue,

        password:passwordValue

    };

    passwords.push(data);

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );

    showToast("Password Saved Successfully");

    website.value="";
    username.value="";
    password.value="";

    renderPasswords();

});

// ===============================
// Password Generator
// ===============================

generateBtn.addEventListener("click",()=>{

    const chars=
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";

    let pass="";

    for(let i=0;i<14;i++){

        pass+=chars.charAt(
            Math.floor(Math.random()*chars.length)
        );

    }

    password.value=pass;

});

// ===============================
// Show Hide Password
// ===============================

togglePassword.addEventListener("click",()=>{

    if(password.type==="password"){

        password.type="text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    }

    else{

        password.type="password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});

// ===============================
// Password Strength
// ===============================

function checkStrength(pass){

    if(pass.length>=12)
        return "Strong";

    if(pass.length>=8)
        return "Medium";

    return "Weak";

}

// ===============================
// Statistics
// ===============================

function updateStats(){

    totalPasswords.innerText=passwords.length;

    let strong=0;
    let weak=0;

    passwords.forEach(item=>{

        if(checkStrength(item.password)==="Strong"){

            strong++;

        }

        else{

            weak++;

        }

    });

    strongPasswords.innerText=strong;

    weakPasswords.innerText=weak;

}

// ===============================
// Render Password Cards
// ===============================

function renderPasswords(){

    passwordContainer.innerHTML="";

    if(passwords.length===0){

        passwordContainer.innerHTML=`

        <div class="empty">

            <i class="fa-solid fa-lock"></i>

            <h2>No Passwords Saved</h2>

            <p>Add your first password.</p>

        </div>

        `;

        updateStats();

        return;

    }

    passwords.forEach(item=>{

        passwordContainer.innerHTML+=`

<div class="password-card">

<h3>${item.website}</h3>

<p>

<strong>User:</strong>

${item.username}

</p>

<p>

<strong>Password:</strong>

<span class="hiddenPassword">

••••••••••

</span>

</p>

<div class="strength">

<span>

${checkStrength(item.password)}

</span>

<div class="bar">

<div class="fill"></div>

</div>

</div>

<div class="actions">

<button
class="copyBtn"
onclick="copyPassword('${item.password}')">

<i class="fa-solid fa-copy"></i>

Copy

</button>

<button
class="showBtn"
onclick="showPassword(this,'${item.password}')">

<i class="fa-solid fa-eye"></i>

Show

</button>

<button
class="deleteBtn"
onclick="deletePassword(${item.id})">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</div>

</div>

`;

    });

    updateStats();

}

// ===============================
// Initial Load
// ===============================

renderPasswords();
// ===============================
// SEARCH PASSWORDS
// ===============================

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const cards = document.querySelectorAll(".password-card");

    cards.forEach(card => {

        const website = card.querySelector("h3").innerText.toLowerCase();
        const username = card.querySelector("p").innerText.toLowerCase();

        if (
            website.includes(value) ||
            username.includes(value)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

// ===============================
// COPY PASSWORD
// ===============================

function copyPassword(pass) {

    navigator.clipboard.writeText(pass);

    showToast("Password Copied");

}

// ===============================
// SHOW / HIDE SAVED PASSWORD
// ===============================

function showPassword(button, pass) {

    const span = button.parentElement.parentElement.querySelector(".hiddenPassword");

    if (span.innerHTML === "••••••••••") {

        span.innerHTML = pass;

        button.innerHTML =
        '<i class="fa-solid fa-eye-slash"></i> Hide';

    } else {

        span.innerHTML = "••••••••••";

        button.innerHTML =
        '<i class="fa-solid fa-eye"></i> Show';

    }

}

// ===============================
// DELETE PASSWORD
// ===============================

function deletePassword(id) {

    if (!confirm("Delete this password?")) {

        return;

    }

    passwords = passwords.filter(item => item.id !== id);

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );

    renderPasswords();

    showToast("Password Deleted");

}

// ===============================
// EDIT PASSWORD
// ===============================

function editPassword(id){

    const item=passwords.find(p=>p.id===id);

    if(!item) return;

    website.value=item.website;
    username.value=item.username;
    password.value=item.password;

    passwords=passwords.filter(p=>p.id!==id);

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );

    renderPasswords();

    showToast("Editing Password");

}

// ===============================
// DARK MODE
// ===============================

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

});

// ===============================
// ENTER KEY TO SAVE
// ===============================

password.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        saveBtn.click();

    }

});

// ===============================
// PASSWORD STRENGTH COLORS
// ===============================

function updateStrengthBars(){

    document.querySelectorAll(".password-card").forEach(card=>{

        const text=card.querySelector(".strength span").innerText;

        const fill=card.querySelector(".fill");

        if(text==="Weak"){

            fill.style.width="30%";
            fill.style.background="#EF4444";

        }

        else if(text==="Medium"){

            fill.style.width="65%";
            fill.style.background="#F59E0B";

        }

        else{

            fill.style.width="100%";
            fill.style.background="#22C55E";

        }

    });

}

const oldRender=renderPasswords;

renderPasswords=function(){

    oldRender();

    updateStrengthBars();

}

// Reload

renderPasswords();