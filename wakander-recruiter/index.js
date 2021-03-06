$(function () {
    $('[data-toggle="collapse"]').collapse();
});

window.onload = routing;
window.onhashchange = routing;

function navigation(tab) {
    window.location.hash = tab;
}

function routing() {
    let tab = window.location.hash.slice(1);
    if((tab == "vagas") || (tab == "perfis") || (tab == "planos") || (tab == "mensagens")) {
        let menuItem = `#${tab}-nav`;

        let allButtons = document.querySelectorAll("#secondary-navigation-menu > label");
        allButtons.forEach(button => {
            button.classList.remove('secondary-nav-item-container-active');
            button.classList.add('secondary-nav-item-container');
        });

        document.querySelector(menuItem).classList.add('secondary-nav-item-container-active');
        document.querySelector(menuItem).classList.remove('secondary-nav-item-container');

        let tabs = document.querySelectorAll(".navigation-tab");
        tabs.forEach(tab => tab.style.display = 'none');
        document.getElementById(tab).style.display = 'block';
    }
}

function toggleSubmitButton() {
    var input = document.getElementById('bookEntryInput');
    var button = document.getElementById('submitBookEntry');
    let value = input.value;

    if(value.length > 1) {
        button.classList.add('success-button');
        button.classList.remove('disabled-button');
    } else {
        button.classList.remove('success-button');
        button.classList.add('disabled-button');
    }
}

function changeDropdownImg() {
    let currentImg = document.getElementById('dropdownImg').src;
    if(currentImg.includes('arrow-down')) { document.getElementById('dropdownImg').src = currentImg.replace('arrow-down', 'arrow-up'); }
    else { document.getElementById('dropdownImg').src = currentImg.replace('arrow-up', 'arrow-down'); }
}