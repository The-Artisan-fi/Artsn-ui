export type ProductDetails = {
    id: number;
    mint: string;
    name: string;
    image: string;
    fractionsLeft: string;
    startingPrice: string;
    earningPotential: string;
};

export type OffChainData = {
    associatedId: string;
    images: string[];
    assetDetails: string
    expectedNetReturn: string;
    marketValue: string;
    pastReturns: string;
    earningPotential: string;
    earningPotentialDuration: string;
    basicInfo: string;
    currency: string;
    description: string;
    model: string;
    offerViews: string;
    sold: string;
    total: string;
}

export type OnChainData = {
    id: number;
    share: number;
    shareSold: number;
    startingPrice: number;
    watchKey: string;
    reference: string;
    braceletMaterial: string;
    brand: string;
    caseMaterial: string;
    dialColor: string;
    diamater: number;
    model: string;
    movement: string;
    yearOfProduction: number;
};

export type Product = {
    id: number;
    reference: string;
    name: string;
    model: string;
    marketValue: number;
    price: number;
    currency: string;
    img: string;
    sold: number;
    total: number;
    stockTag: string;
    fractionLeft: number;
    pastReturns: string;
    pastReturnsSuffix: string;
    earningPotential: string;
    earningPotentialSuffix: string;
    earningPotentialDuration: string;
    expectedNetReturn: string;
    offerViews: number;
    investUrl: string;
    description: string;
    gallery: string[];
}

export type FAQ = {
    key: string;
    question: string;
    answer: string;
}

export type Image = {
    original: string
    thumbnail: string,
    originalHeight: number,
}

export type StringKeyValueType = {
    [link: string]: string;
};