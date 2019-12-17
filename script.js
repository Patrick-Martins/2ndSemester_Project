window.addEventListener("DOMContentLoaded", init);

function init() {
    //searching for parameters in the page URL
    const urlParams = new URLSearchParams(window.location.search);
    //grab id=something from the url (it might not exist)
    const category = urlParams.get("category");
    const id = urlParams.get("id");
    const post = urlParams.get("post");

    //calling a function only if certain parameters exist in the URL
    if (id) {
        getShopItem();
    } else if (category) {
        if (category == 5) {
            getCategoryData();
        } else {
            showGallery();
            //if there exists an object with the class "filterGallery" in the page call these functions
            if (document.querySelector(".filterGallery")) {
                getFilterData();
                getFilter();
            }
        }
    } else if (post) {
        if (post == 13) {
            getAboutData();
        } else if (post == 119) {

        } else {
            getContactData();
        }

    }
}

function getContactData() {
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/posts/17?_embed").then(res => res.json()).then(organize);
}

function getAboutData() {
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/posts/13?_embed").then(res => res.json()).then(organize);
}

function organize(stuff) {

    if (stuff.id == 13) {
        const container = document.querySelector(".about-container");
        const image = document.querySelector(".about-image");
        const imgPath = stuff._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;

        image.setAttribute("src", imgPath);
        container.innerHTML = stuff.content.rendered;
    } else if (stuff.id == 17) {
        document.querySelector(".contact-info").innerHTML = stuff.content.rendered;
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
    //fetching the different categories/styles the artist has worked with
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
    //copying a template from the html page
    const template = document.querySelector(".galleryTemplate").content;
    const templateCopy = template.cloneNode(true);
    //putting data from the fetch we made into the the template copy
    const elementContainer = templateCopy.querySelector(".type");
    const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
    elementContainer.style.backgroundImage = `url(${imgPath})`;
    templateCopy.querySelector("h2").textContent = element.title.rendered;
    elementContainer.addEventListener("click", function () {
        console.log(element.categories);
        //checking what the category of the painting is. The different styles have only 2 categories and that is why the function is comparing between them to choose the right one(the one whose id is not 5).
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
    //fetching all the paintings with the category that is displayed in the URL
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/painting?_embed&categories=" + category).then(res => res.json()).then(galleryForEach)
}

function galleryForEach(item) {
    //seperating the array of paintings to seperate paintings
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
        //creating a copy of a template from the html and filling it with the data from the fetching
        const template = document.querySelector("template").content;
        const templateCopy = template.cloneNode(true);
        const imgPath = element._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
        const img = templateCopy.querySelector("img");
        img.setAttribute("src", imgPath);
        //adding an event to the image that opens a modal to show the clicked image in a bigger scale
        img.addEventListener("click", function () {
            const modal = document.querySelector(".bg");
            const modalImg = document.querySelector(".mdlImg");
            const body = document.querySelector("html");
            modalImg.setAttribute("src", imgPath);
            body.classList.add("open"); //prevents the page from scrolling
            modal.classList.remove("hide"); //makes the modal visible
            //a function that closes the moal by clicking on it
            modal.addEventListener("click", function () {
                modal.classList.add("hide"); //hides the modal
                body.classList.remove("open"); //enables åpage scrolling
            })

        })
        document.querySelector(".gallery").appendChild(templateCopy);

    }
}

function getFilterData() {
    //fetching the styles of painting the artist has worked with
    fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=5").then(res => res.json()).then(optionForEach);
}

function optionForEach(option) {
    //seperating the paintings array to seperate paintings
    option.forEach(makeOption);
    option.forEach(filtering);
}

function makeOption(optionData) {
    //creates an "option" tag with the value of the painting style name and appending it to the html
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
    //if one of the option's categories equals the integer number from the URL, make that option the selected one that is shown to the user
    if (optionValue.categories.includes(integer)) {
        document.getElementById("filter").value = optionValue.title.rendered;
    }
}

function getFilter() {
    const filter = document.getElementById("filter");
    //whenever the value of the filter option changes, the styles will be fetched
    filter.addEventListener("change", function () {
        fetch("http://pjmelite.dk/KEA_2Semester/2Sem_Project/wp_2ndSemProj/wp-json/wp/v2/gallery_element?_embed&categories=5").then(res => res.json()).then(needToCompare);
    })
}

function needToCompare(data) {
    //seperating the styles
    data.forEach(compare);
}

function compare(option) {
    //checking if the string in the filter and the title in the fetch are the same
    if (option.title.rendered == filter.value) {
        //if yes, take the category that is not 5
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

const shopBTN1 = document.querySelector(".portrait .shopButton");
shopBTN1.addEventListener("click", function () {
    location.href = "shop.html?category=7";
})

const shopBTN2 = document.querySelector(".landscape .nav-social-media .shopButton");
shopBTN2.addEventListener("click", function () {
    location.href = "shop.html?category=7";
})


if (window.location.href.substr(-10) == "index.html") {
    const moreAboutBTN = document.querySelector(".moreabout-button");
    const moreGalleryBTN = document.getElementById("moreGalleryBTN");
    const moreShopBTN = document.getElementById("moreShopBTN");


    moreAboutBTN.addEventListener("click", function () {
        location.href = "about.html?post=13";
    })
    moreGalleryBTN.addEventListener("click", function () {
        location.href = "gallery.html?category=5";
    })
    moreShopBTN.addEventListener("click", function () {
        location.href = "shop.html?category=7";
    })
}
