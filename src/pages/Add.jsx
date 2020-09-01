import React, { useState, useRef, useEffect } from 'react';
import './Add.css';
import { base64ToMB } from '../lib/base64';
import { resizeImage } from '../lib/imageManip';
import { useRouteMatch } from 'react-router-dom';
import { dodoFlight, methods, dodoRoutes, timeouts } from '../lib/dodoAirlines';

const Add = () => {

    const match = useRouteMatch("/edit/:resid");

    const imageRef = useRef(null);

    const imageConfig = useRef({
        width: 600,
        widthSmall: 300,
        ratio: 1,
    });

    const [imageData, setImageData] = useState({
        image: '',
        imageCompressed: '',
        imageCompressedSmall: '',
    })

    const [data, setData] = useState({
        name: '',
        desc: '',
        city: '',
        part: '',
        street: '',
        number: 0,
        postcode: '',
        website: '',
    })

    useEffect(() => {
        if (match) {

            const resid = match.params.resid;

            dodoFlight({
                url: dodoRoutes.get.restaurantProfile + resid,
            }).then((res) => {

                if (res.data != false) {

                    const d = res.data[0];

                    imageData.imageCompressed = d.foto1;

                    setImageData({
                        ...imageData,
                    })

                    setData({
                        name: d.naam,
                        street: d.straat,
                        postcode: d.Postcode,
                        number: d.huisnummer,
                        desc: d.omschrijving,
                        website: d.website,
                        city: d.stad,
                        part: d.stadsdeel,
                    });
                } else {
                    alert('Unknown RESID')
                }
            });

            dodoFlight({
                url: dodoRoutes.get.restaurantProfPic + resid,
            }).then((res) => {

                if (res.data) {

                    imageData.imageCompressedSmall = res.data.foto;

                    setImageData({
                        ...imageData,
                    })
                }
            })

        }
    }, [])

    const submitRestaurant = async () => {

        let toPost = {
            naam: data.name,
            straat: data.street,
            postcode: data.postcode,
            huisnummer: data.number,
            omschrijving: data.desc,
            website: data.website,
            stad: data.city,
            stadsdeel: data.part,
            foto1: imageData.imageCompressed,
            profpic: imageData.imageCompressedSmall,
        }

        if (match)
            toPost = {
                ...toPost,
                resid: match.params.resid,
            }


        await dodoFlight({
            url: dodoRoutes.post.restaurant,
            method: methods.post,
            data: toPost,
            timeout: timeouts.long,
        }).then((res) => {
            if (res) {
                if (res.data)
                    alert('success');
                else
                    alert('Fail');
            } else alert('No res')
        })

    }

    return (
        <main className="add">
            <h1 className="add-header">Locatie {(match) ? 'wijzigen' : 'toevoegen'}</h1>
            <h2 className="add-sub-header">Naam</h2>
            <input type="text" value={data.name} className="add-text" onChange={(e) => {
                setData({
                    ...data,
                    name: e.target.value,
                })
            }} />
            <h2 className="add-sub-header">Beschrijving</h2>
            <textarea value={data.desc} cols="16" rows="5" onChange={(e) => {
                setData({
                    ...data,
                    desc: e.target.value,
                })
            }} />

            <h2 className="add-sub-header">Adres</h2>
            <div className="add-address">

                <div className="add-address-item">
                    <h3 className="add-address-header">Stad</h3>
                    <input type="text" value={data.city} placeholder="Stad" className="add-text" onChange={(e) => {
                        setData({
                            ...data,
                            city: e.target.value,
                        })
                    }} />
                </div>

                <div className="add-address-item">
                    <h3 className="add-address-header">Stadsdeel</h3>
                    <input type="text" value={data.part} placeholder="Stadsdeel" className="add-text" onChange={(e) => {
                        setData({
                            ...data,
                            part: e.target.value,
                        })
                    }} />
                </div>

                <div className="add-address-item">
                    <h3 className="add-address-header">Straat</h3>
                    <input type="text" value={data.street} placeholder="Straat" className="add-text" onChange={(e) => {
                        setData({
                            ...data,
                            street: e.target.value,
                        })
                    }} />
                </div>

                <div className="add-address-item">
                    <h3 className="add-address-header">Huisnummer</h3>
                    <input type="text" value={data.number} placeholder="Huisnummer" className="add-text" onChange={(e) => {
                        setData({
                            ...data,
                            number: e.target.value,
                        })
                    }} />
                </div>

                <div className="add-address-item">
                    <h3 className="add-address-header">Postcode</h3>
                    <input type="text" value={data.postcode} placeholder="Postcode" className="add-text" onChange={(e) => {
                        setData({
                            ...data,
                            postcode: e.target.value,
                        })
                    }} />
                </div>
            </div>

            <h2 className="add-sub-header">Website</h2>
            <input type="text" value={data.website} className="add-text" onChange={(e) => {
                setData({
                    ...data,
                    website: e.target.value,
                })
            }} />


            <h2 className="add-sub-header">Afbeeldingen</h2>

            <h3 className="add-sub-header">Main width (pixels)</h3>
            <input type="number" defaultValue={imageConfig.current.width} min={0} placeholder="width in pixels" onChange={(e) => {
                imageConfig.current.width = e.target.valueAsNumber
            }} />

            <h3 className="add-sub-header">Profile picture width (pixels)</h3>
            <input type="number" defaultValue={imageConfig.current.widthSmall} min={0} placeholder="width in pixels" onChange={(e) => {
                imageConfig.current.widthSmall = e.target.valueAsNumber
            }} />

            <h3 className="add-sub-header">Compression Rate</h3>
            <input type="number" defaultValue={imageConfig.current.ratio} max={1} step={0.1} min={0} placeholder="compression, 0 to 1" onChange={(e) => {
                imageConfig.current.ratio = e.target.valueAsNumber
            }} />

            <input className="add-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                    setImageData({
                        ...imageData,
                        image: URL.createObjectURL(e.target.files[0]),
                    })
                }}
            />

            <p>Main image {(imageData.imageCompressed) ? base64ToMB(imageData.imageCompressed) : 'Size in'} MegaBytes</p>
            <p>Profile picture {(imageData.imageCompressedSmall) ? base64ToMB(imageData.imageCompressedSmall) : 'Size in'} MegaBytes</p>

            <img className="add-image" src={imageData.image} ref={c => imageRef.current = c} onLoad={() => {
                setImageData({
                    ...imageData,
                    imageCompressed: resizeImage(imageRef.current, imageConfig.current.width, imageConfig.current.ratio),
                    imageCompressedSmall: resizeImage(imageRef.current, imageConfig.current.widthSmall, imageConfig.current.ratio),
                })
            }} />
            <div className="add-image-compressed">
                <img className="add-image-compressed-image" src={imageData.imageCompressed} />
            </div>

            <div className="add-image-compressed">
                <img className="add-image-compressed-image" src={imageData.imageCompressedSmall} />
            </div>

            <button className="add-submit"
                onClick={async () => {
                    submitRestaurant();
                }}>Submit</button>

        </main>
    );
}



export default Add;