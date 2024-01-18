// images
import audemarsPigue from "./assets/home/products/Audemars-piguet-Royaloak.webp";
import rolexCosmographDaytona from "./assets/home/products/Rolex-Cosmograph-daytona.webp";
import ferrari from "./assets/home/products/ferrari512-testa-rossa.webp";
import picasoPainting from "./assets/home/products/Pablo-Picasso-les-femmes-d-alger.webp";

// products data
const products = {
    available: [
        {
            id: 1,
            increment: "+8,1% Y*",
            name: "Audemars piguet Royal oak",
            image: audemarsPigue,
        },
        {
            id: 2,
            increment: "+8,1% Y*",
            name: "ferrari 512 testa rossa",
            image: ferrari,
        },
        {
            id: 3,
            increment: "+8,1% Y*",
            name: "Pablo Picasso les femmes d’alger, 1955",
            image: picasoPainting,
        },
    ],

    comingSoon: [
        {
            id: 1,
            increment: "+8,1% Y*",
            name: "Rolex Cosmograph daytona",
            image: rolexCosmographDaytona,
            releaseDate: "22 Feb",
        },
        {
            id: 2,
            increment: "+8,1% Y*",
            name: "ferrari 512 testa rossa",
            image: ferrari,
            releaseDate: "03 March",
        },
        {
            id: 3,
            increment: "+8,1% Y*",
            name: "Pablo Picasso les femmes d’alger, 1955",
            image: picasoPainting,
            releaseDate: "07 April",
        },
    ],
};

export default products;
