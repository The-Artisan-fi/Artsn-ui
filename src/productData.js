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
            fractionsLeft: "105 / 350",
            startingPrice: "100$",
            earningPotential: "+8,1% y*",
        },
        {
            id: 2,
            increment: "+8,1% Y*",
            name: "ferrari 512 testa rossa",
            image: ferrari,
            fractionsLeft: "105 / 350",
            startingPrice: "100$",
            earningPotential: "+8,1% y*",
        },
        {
            id: 3,
            increment: "+8,1% Y*",
            name: "Pablo Picasso les femmes d’alger, 1955",
            image: picasoPainting,
            fractionsLeft: "105 / 350",
            startingPrice: "100$",
            earningPotential: "+8,1% y*",
        },

        {
            id: 4,
            increment: "+8,1% Y*",
            name: "Rolex Cosmograph daytona",
            image: rolexCosmographDaytona,
            fractionsLeft: "105 / 350",
            startingPrice: "100$",
            earningPotential: "+8,1% y*",
        },
    ],

    comingSoon: [
        {
            id: 1,
            name: "Rolex Cosmograph daytona",
            image: rolexCosmographDaytona,
            releaseDate: "TBD",
            startingPrice: "100$",
            earningPotential: "TBD",
        },
        {
            id: 2,
            name: "ferrari 512 testa rossa",
            image: ferrari,
            releaseDate: "TBD",
            startingPrice: "100$",
            earningPotential: "TBD",
        },
        {
            id: 3,
            name: "Pablo Picasso les femmes d’alger, 1955",
            image: picasoPainting,
            releaseDate: "TBD",
            startingPrice: "100$",
            earningPotential: "TBD",
        },

        {
            id: 4,
            name: "Audemars piguet Royal oak",
            image: audemarsPigue,
            releaseDate: "TBD",
            startingPrice: "100$",
            earningPotential: "TBD",
        },
    ],
};

export default products;
