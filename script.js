const hamburguerBTN = document.getElementById("hamburguer");
const body = document.querySelector("body");

hamburguerBTN.addEventListener("click", openNav);

function openNav() {
    document.querySelector(".sidenav").style.width = "100%"
    hamburguerBTN.removeEventListener("click", openNav);
    hamburguerBTN.addEventListener("click", closeNav);
    hamburguerBTN.src = "Assets/icones/arrow_back.svg";

}

function closeNav() {
    document.querySelector(".sidenav").style.width = "0";
    hamburguerBTN.removeEventListener('click', closeNav);
    hamburguerBTN.addEventListener("click", openNav);
    hamburguerBTN.src = "Assets/icones/burger_menu.svg";
}
