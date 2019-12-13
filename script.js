
window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //grab id=something from the url (it might not exist)
    const id = urlParams.get("id");
    const category = urlParams.get("category");


    if (id) {
        getEventData();
    } else if (category) {
        if (category == 5) {
            getCategoryData();
        } else {
            showGallery();
        }
    }
}

const filter = document.querySelector(".filterGallery");


function getCategoryData() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");


    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=" + category).then(res => res.json()).then(showStuff);
}

function showStuff(data) {
    console.log(data);
    data.forEach(showElements);
}

function showElements(element) {
    console.log(element);
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const template = document.querySelector(".galleryTemplate").content;
    const templateCopy = template.cloneNode(true);

    const elementContainer = templateCopy.querySelector(".type");
    //console.log("hey");
    //console.log(element._embedded["wp:featuredmedia"][0].media_details);
    const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
    elementContainer.style.backgroundImage = `url(${imgPath})`;
    templateCopy.querySelector("h2").textContent = element.title.rendered;
    elementContainer.addEventListener("click", function () {
        location.href = `sub-gallery.html/category=${element.title.rendered}`
        console.log(element.categories);
        if (element.categories[0] === 5) {
            console.log(element.categories[1]);
            location.href = `sub-gallery.html?category=${element.categories[1]}`
        } else {
            console.log(element.categories[0]);
            location.href = `sub-gallery.html?category=${element.categories[0]}`
        }
    })

    document.querySelector(".types").appendChild(templateCopy);
}

function showGallery() {
    console.log("showgallery");
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    console.log(category);
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/painting?_embed&categories=" + category).then(res => res.json()).then(galleryForEach)
}

function galleryForEach(item) {
    console.log(item);
    item.forEach(showGalleryItem);

}

function showGalleryItem(element) {

    console.log("showgallery");
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");


    if (category == 7) {
        const template = document.querySelector(".shopTemplate").content;
        const templateCopy = template.cloneNode(true);

        const elementContainer = templateCopy.querySelector(".type");
        const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
        elementContainer.style.backgroundImage = `url(${imgPath})`;
        templateCopy.querySelector(".shopElemTitle").textContent = element.title.rendered;
        templateCopy.querySelector(".shopElemPrice").textContent = element.price;

        document.querySelector(".shop-container").appendChild(templateCopy);
    } else {

        const template = document.querySelector("template").content;
        const templateCopy = template.cloneNode(true);
        const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
        templateCopy.querySelector("img").setAttribute("src", imgPath);
        document.querySelector(".gallery").appendChild(templateCopy);

    }
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
