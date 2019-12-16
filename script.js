window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //grab id=something from the url (it might not exist)
    const category = urlParams.get("category");



    if (id) {
        getShopItem();
    } else if (category) {
  if (category == 5) {
            getCategoryData();
        } else {
            showGallery();
            if (document.querySelector(".filterGallery")) {
                getFilterData();
                getFilter();
            }
        }
    }
}



function getShopItem() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/painting/" + id + "?_embed").then(res => res.json()).then(showShopItem);
}

function getCategoryData() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");


    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=" + category).then(res => res.json()).then(showStuff);
}

function showShopItem(item) {
    const template = document.querySelector(".shopInfoTemplate").content;
    const templateCopy = template.cloneNode(true);

    const itemImage = templateCopy.querySelector("img");
    const imgPath = item._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
    itemImage.src = imgPath;

    const itemTitle = templateCopy.querySelector(".shop-painting-title");

    itemTitle.innerHTML = item.title.rendered;

    const itemDescription = templateCopy.querySelector(".shop-painting-description");

    itemDescription.innerHTML = item.content.rendered;

    templateCopy.querySelector(".contact-button").addEventListener("click", function () {
        location.href = `shop.html`;
    })


    console.log("My id is " + item.id);

    templateCopy.querySelector(".shop-painting-title").textContent = item.title.rendered;
    templateCopy.querySelector(".shop-painting-price").textContent = item.price;

    document.querySelector("main").appendChild(templateCopy);

}

function showStuff(data) {
    data.forEach(showElements);
}

function showElements(element) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const template = document.querySelector(".galleryTemplate").content;
    const templateCopy = template.cloneNode(true);

    const elementContainer = templateCopy.querySelector(".type");
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
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/painting?_embed&categories=" + category).then(res => res.json()).then(galleryForEach)
}

function galleryForEach(item) {
    item.forEach(showGalleryItem);

}

function showGalleryItem(element) {

    //    console.log("showgallery");
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");


    if (category == 7) {
        const template = document.querySelector(".shopTemplate").content;
        const templateCopy = template.cloneNode(true);

        const elementContainer = templateCopy.querySelector(".type");
        const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
        elementContainer.style.backgroundImage = `url(${imgPath})`;

        templateCopy.querySelector(".shopElem").addEventListener("click", function () {
            location.href = `sub-shop.html?id=${element.id}`
        })


        console.log("My id is " + element.id);

        templateCopy.querySelector(".shopElemTitle").innerHTML = element.title.rendered;
        templateCopy.querySelector(".shopElemPrice").textContent = element.price;

        document.querySelector(".shop-container").appendChild(templateCopy);
    } else {

        const template = document.querySelector("template").content;
        const templateCopy = template.cloneNode(true);
        const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
        const img = templateCopy.querySelector("img");
        img.setAttribute("src", imgPath);
        img.addEventListener("click", function () {
            const modal = document.querySelector(".bg");
            const modalImg = document.querySelector(".mdlImg");
            const body = document.querySelector("body");
            modalImg.setAttribute("src", imgPath);
            body.classList.add("open");
            modal.classList.remove("hide");
            modal.addEventListener("click", function () {
                modal.classList.add("hide");
                body.classList.remove("open");
            })

        })
        document.querySelector(".gallery").appendChild(templateCopy);

    }
}

function getFilterData() {
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=5").then(res => res.json()).then(optionForEach);
}

function optionForEach(option) {
    option.forEach(makeOption);
    option.forEach(filtering);
}

function makeOption(optionData) {
    const filter = document.getElementById("filter");
    const anOption = document.createElement("option");
    anOption.textContent = optionData.title.rendered;
    filter.appendChild(anOption);
}

function filtering(optionValue) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    // used google for this one. Converts the "category" string into a number.
    // taken from https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/
    const integer = parseInt(category, 10);
    if (optionValue.categories.includes(integer)) {
        document.getElementById("filter").value = optionValue.title.rendered;
    }
}

function getFilter() {
    const filter = document.getElementById("filter");
    filter.addEventListener("change", function () {
        fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=5").then(res => res.json()).then(needToCompare);
    })
}

function needToCompare(data) {
    data.forEach(compare);
}

function compare(option) {
    if (option.title.rendered == filter.value) {
        if (option.categories[0] !== 5) {
            location.href = `sub-gallery.html?category=${option.categories[0]}`
        } else {
            location.href = `sub-gallery.html?category=${option.categories[1]}`
        }
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
