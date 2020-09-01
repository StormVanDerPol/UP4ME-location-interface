import React, { useEffect, useState, useRef } from 'react';
import { dodoFlight, dodoRoutes, timeouts, methods } from '../lib/dodoAirlines';
import './Overview.css';
import { Link } from 'react-router-dom';

const Overview = () => {

    const [localeList, setLocaleList] = useState({});

    const [canRender, setCanRender] = useState(false);

    const [current, setCurrent] = useState(null)

    useEffect(() => {

        dodoFlight({
            url: dodoRoutes.get.restaurantListTo,
            timeout: timeouts.long,
        }).then((res) => {

            let list = res.data;

            let i = 0;

            for (const location of list) {

                console.log('iteration', i);
                console.log('Handling location', location);

                if (!location.stadsdeel)
                    location.stadsdeel = '0';

                if (!Object.keys(localeList).includes(location.stad)) {

                    localeList[location.stad] = { [location.stadsdeel]: [location] };
                    console.log(`ADDED ${location.stad} > ${location.stadsdeel} containing [${location.naam}] -- Neither Existed`);
                } else if (!Object.keys(localeList[location.stad]).includes(location.stadsdeel)) {
                    localeList[location.stad][location.stadsdeel] = [location];
                    console.log(`ADDED ${location.stadsdeel} to ${location.stad} containing [${location.naam}] -- City Exists, Part did not`);
                } else {
                    localeList[location.stad][location.stadsdeel].push(location);
                    console.log(`PUSHED ${location.naam} to ${location.stadsdeel} within ${location.stad} -- Both exist`);
                }

                i++;

            }

            console.log('RESULT', localeList);

            setLocaleList({
                ...localeList,
            })

            setCanRender(true);

        })

    }, []);

    return (
        <main className="overview">
            <h1 className="overview-header">Overzicht</h1>

            {(canRender) ? <CitySelector localeList={localeList} onChange={(output) => {
                setCurrent(output);
            }} /> : <></>}

            <div className="overview-list-container">
                {(canRender) ? <div className="overview-list">
                    {(current) ? localeList[current.city][current.part].map((location, i) => {
                        return <LocationItem key={i} data={location} />
                    }) : <p>Current is null</p>}
                </div> : <p>please wait</p>}
            </div>

        </main>
    );
}

const CitySelector = ({ localeList, onChange = (current) => { } }) => {

    const initCity = Object.keys(localeList)[0];
    const initPart = Object.keys(localeList[initCity])[0]

    const [current, setCurrent] = useState({
        city: initCity,
        part: initPart,
    });

    useEffect(() => {
        onChange(current);
    }, [current])

    return (
        <div className="city-selector">
            <h3 className="city-selector-header">Stad</h3>
            {Object.keys(localeList).map((city, i) => {
                return (
                    <div key={i} className="city-selector-section">
                        <input className="city-selector-radio" checked={(current.city == city)} type="radio" name="city" value={city} onChange={(e) => {

                            const newPart = Object.keys(localeList[city])[0];

                            setCurrent({
                                city: city,
                                part: newPart,
                            })
                        }} />
                        <span className="city-selector-radio-header">{city}</span>
                    </div>
                )
            })}
            <h3 className="city-selector-header">Stadsdeel</h3>
            {Object.keys(localeList[current.city]).map((part, i) => {

                if (part != '0') {

                    return (
                        <div key={i} className="city-selector-section">
                            <input className="city-selector-radio" checked={(current.part == part)} type="radio" name="part" value={part} onChange={(e) => {
                                setCurrent({
                                    ...current,
                                    part: part,
                                })
                            }} />
                            <span className="city-selector-radio-header">{part}</span>
                        </div>
                    )
                }
            })}
        </div>
    )

}

const LocationItem = ({ data }) => {

    const [image, setImage] = useState('');

    useEffect(() => {
        dodoFlight({
            url: dodoRoutes.get.restaurantProfPic + data.resid,
        }).then(({ data }) => {
            setImage(data.foto);
        })
    }, [])

    return (
        <div className="location-item">
            <div className="location-item-section">
                <h3 className="location-item-text">{data.naam} - #{data.resid}</h3>
                <h4 className="location-item-text">{data.stad} {(data.stadsdeel != 0) ? data.stadsdeel : ''}</h4>
                <h4 className="location-item-text">{data.straat} {data.huisnummer} {data.Postcode}</h4>
                <p className="location-item-text">{data.omschrijving}</p>
                <a className="location-item-text" href={data.website}>{data.website}</a>
            </div>
            <div className="location-item-section">
                <img className="location-item-image" src={image} />
                <Link className="location-item-edit" to={`/edit/${data.resid}`}>Edit</Link>
                <button onClick={async () => {

                    await dodoFlight({
                        method: methods.post,
                        url: dodoRoutes.post.deleteRestaurant,
                        data: {
                            resid: data.resid,
                        }
                    })

                    window.location.reload();

                }} className="location-item-edit">delet this</button>
            </div>
        </div>
    )
}

export default Overview;