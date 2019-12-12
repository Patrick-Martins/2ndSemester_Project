window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //grab id=something from the url (it might not exist)
    const id = urlParams.get("id");
    const category = urlParams.get("category");


    if (id) {
        getEventData();
    } else if (category) {
        getCategoryData();

    }
}

function getCategoryData() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/painting?_embed&categories=" + category).then(res => res.json()).then(showStuff);
}

function showStuff(data) {
    console.log(data);
    data.forEach(showElements);
}

function showElements(element){
    console.log(element);
    const template = document.querySelector(".galleryTemplate").content;
    const templateCopy = template.cloneNode(true);

    const elementContainer = templateCopy.querySelector(".type");
    const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
    elementContainer.style.backgroundImage = `url(${imgPath})`;
    templateCopy.querySelector("h2").textContent = element.title.rendered;

    document.querySelector(".types").appendChild(templateCopy);
}

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
