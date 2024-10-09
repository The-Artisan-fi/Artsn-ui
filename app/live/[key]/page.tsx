'use client'
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, use } from 'react';
import {ActionGetResponse, ActionPostResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, } from "@solana/actions"

// sample url:
// /protocol?action=solana-action%3Ahttps%3A%2F%2Fbeta.artsn.fi%2Fapi%2Fblink
// action would be referred to as the key in the url
export default function BlinkPage(
    { params }: { params: { key: string } }
) { 
    const { publicKey } = useWallet();
    const [data, setData] = useState<any>(null);
    // ?action=solana-action%3Ahttps%3A%2F%2Fbeta.artsn.fi%2Fapi%2Fblink
    // action would be referred to as the key in the url
    const action = params.key;
    console.log('action', params);
    const decodedUri = decodeURIComponent(action); //action=solana-action:https://beta.artsn.fi/api/blink
    console.log('decodedUri', decodedUri); 
    // ping the `https://beta.artsn.fi/api/blink` part of the decodedUri with a GET request to get the data

    async function handlePostRequest(href: string) {
        console.log('href', href); ///api/blink/1
        // derive the baseUrl from the decodedUri
        const baseUrl = decodedUri.split(':')[1] + ':' + decodedUri.split(':')[2]; //https://beta.artsn.fi/api/blink
        console.log('baseUrl', baseUrl);
        // remove anything after the / from the baseUrl
        const _url = baseUrl.split('/')[0] + baseUrl.split('/')[1]; //https://beta.artsn.fi
        const _completeUrl = _url + href;
        const response = await fetch(href, {
            method: 'POST',
            headers: ACTIONS_CORS_HEADERS,
            body: JSON.stringify({
                // body
                account: publicKey,
            })
        });
        const data = await response.json();
        console.log('data', data);
    };
    
    const getReq = async () => {
        const _url = decodedUri.split(':')[1] + ':' + decodedUri.split(':')[2];
        console.log('_url', _url);
        const response = await fetch(_url);
        const data = await response.json();
        console.log('data', data.links.actions[0]);
        setData(data);
        // data {
        //     icon: 'https://artisan-solana.s3.eu-central-1.amazonaws.com/ArtisanBlink.png',
        //     label: 'Invest in Real World Assets with Artsn.Fi',
        //     title: 'Real World Asset Investing - Artsn.Fi',
        //     description: 'Choose from a selection of real world assets to invest in for $1 USDC-Dev.',
        //     links: { actions: [ [Object], [Object], [Object], [Object] ] }
        //   }
        
    }

    useEffect(() => {
        getReq();
    }, []);

    return (
        <div>
            {data && (
                <div>
                    <img src={data.icon} alt={data.label} />
                    <h1>{data.title}</h1>
                    <p>{data.description}</p>
                    <button onClick={() => handlePostRequest(data.links.actions[0].href)}>Invest</button>
                </div>
            )}
        </div>
    )
};