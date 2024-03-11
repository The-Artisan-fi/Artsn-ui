"use client"
import { useState } from "react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { MantineProvider } from '@mantine/core';
import useSWR from "swr";
import { Image } from "@mantine/core";
import useSWRMutation from "swr/mutation";
import '@mantine/dropzone/styles.css';
import { useMutation } from "@apollo/client";
import { ADD_LISTING } from "@/lib/mutations";


export default function Create() {
    // DATABASE MUTATION****************************************************
    const [variables, setVariables] = useState({
        associatedId: "",
        assetDetails: "",
        earningPotential: "",
        earningPotentialDuration: "",
        expectedNetReturn: "",
        images: [
            "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        ],
        marketValue: "",
        pastReturns: ""
      });
    const [addListing, { loading, error, data }] = useMutation(ADD_LISTING);
    
    // ****************************************************

    // S3 IMAGE UPLOAD AND FETCH****************************************************
    async function uploadDocuments(
        url: string,
        { arg }: { arg: { files: FileWithPath[] } }
      ) {
        const body = new FormData();
        arg.files.forEach((file) => {
          body.append("file", file, file.name);
        });
      
        const response = await fetch(url, { method: "POST", body });
        console.log('upload response', await response.json())
        return await response.json();
      }
    // when uploading a document, there seem to be a slight delay, so wait ~1s
    // before refreshing the list of documents `mutate("/api/documents")`.
    const { trigger } = useSWRMutation("/api/aws/s3/upload", uploadDocuments);

    const fetcher = (path: string) => fetch(path).then((res) => res.json());
    
    const Images = () => {
        const { data } = useSWR<{ Key?: string }[]>("/api/aws/s3/upload", fetcher)
        if(!data) return null
        console.log("images ",data)
        // @ts-expect-error : data is not null
        return data?.map((image) => <S3Image Key={image.Key} />)
    }

    const S3Image = ({ Key }: { Key: string }) => {
        const { data } = useSWR<{ src: string }>(`/api/aws/s3/get/${Key}`, fetcher)
        if (!data) return null
        console.log(data)
        return <Image src={data.src} style={{height: '60px', width: '60px'}}/>
    }
    // ****************************************************

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "200px",
                alignContent: "center",
                margin: "auto"
            }}
        >
            <MantineProvider>
                <Dropzone
                    onDrop={(files) => trigger({ files })}
                    // style as a file upload zone
                    style={{
                        padding: 20,
                        border: "2px dashed #666",
                        borderRadius: 5,
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                Upload Zone
                </Dropzone>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                    }}
                >
                    <Images />
                </div>
            </MantineProvider>

            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    addListing(
                        {
                            variables: {
                                assetDetails: variables.assetDetails,
                                associatedId: variables.associatedId,
                                earningPotential: variables.earningPotential,
                                earningPotentialDuration: variables.earningPotentialDuration,
                                expectedNetReturn: variables.expectedNetReturn,
                                images: variables.images,
                                marketValue: variables.marketValue,
                                pastReturns: variables.pastReturns
                            }
                        }
                    );
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "200px"
                }}
            >
                <input
                    type="text"
                    placeholder="associatedId"
                    onChange={(e) => {
                        setVariables({ ...variables, associatedId: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="assetDetails"
                    onChange={(e) => {
                        setVariables({ ...variables, assetDetails: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="earningPotential"
                    onChange={(e) => {
                        setVariables({ ...variables, earningPotential: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="earningPotentialDuration"
                    onChange={(e) => {
                        setVariables({ ...variables, earningPotentialDuration: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="expectedNetReturn"
                    onChange={(e) => {
                        setVariables({ ...variables, expectedNetReturn: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="marketValue"
                    onChange={(e) => {
                        setVariables({ ...variables, marketValue: e.target.value });
                    }}
                />
                <input
                    type="text"
                    placeholder="pastReturns"
                    onChange={(e) => {
                        setVariables({ ...variables, pastReturns: e.target.value });
                    }}
                />
                <button type="submit">Submit</button>
            </form>

            {!loading && !error && data && (
                <div>
                    <h1>Submission success!</h1>
                    <p>{JSON.stringify(data)}</p>
                </div>
            )}
            {loading && <p>Submitting...</p>}
        </div>
    )
}