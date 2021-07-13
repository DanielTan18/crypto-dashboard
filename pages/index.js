import { Table } from "react-bootstrap";
import Image from 'next/image';
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faStar, faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(fab,faStar,faCheck)

const fetch = require("node-fetch");

export const getStaticProps = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d"
  );
  const data = await res.json();

  return {
    props: { coins: data },
  };
};

export default function Home({ coins }) {
  const [favourite, setFavourite] = useState([]);
  const formatPercent = (number) => `${new Number(number).toFixed(2)}%`;

  const formatDollar = (number, maxSignificantDigits) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
      maxSignificantDigits,
    }).format(number);

  const addFavourite = (id) => {
    const favArr = [localStorage.getItem("favArr")].toString().split(',');

    console.log("coin id is " + id);

    // if favourite empty & localstorage is not
    if (
      favourite.length == 0 &&
      typeof (favArr !== "undefined") &&
      favArr !== null
    ) {
      if (!favArr.includes(id)) {
          favArr.push(id);
          localStorage.setItem("favArr", favArr);
      }
    } else if (!favourite.includes(id)) {
      if (!favArr.includes(id)) {
        setFavourite(favourite.concat(id));
        favArr.push(id);
        localStorage.setItem("favArr", favArr);
      }
    }
    
    alert(id.charAt(0).toUpperCase() + id.slice(1) +" has been added to favourites!");
  };

  useEffect(() => {
    console.log("favourite is " + favourite);
    console.log("local storage array is " + localStorage.getItem("favArr"));
  }, [favourite]);

  return (
    <Container>
      <br></br>
      <h1 className="text-center">Crypto Dashboard</h1>
      <h3 className="text-center">
        <a href="favourites">Favourites Page</a>
      </h3>
      <br></br>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th> # </th>
            <th> Symbol </th>
            <th> Price </th>
            <th> Total Volume </th>
            <th> Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td>
                <FontAwesomeIcon
                icon="star"
                className="button"
                  // icon={favArr.toString().split(',').includes(coin.id)?"check":"star"}
                  onClick={(e) => {addFavourite(coin.id)}}
                />
              </td>
              <td>
                  <Image
                    src={coin.image}
                    width={25}
                    height={25}
                  />
                
                &ensp;{coin.name} {coin.symbol.toUpperCase()}
              </td>

              <td>{formatDollar(coin.current_price)}</td>
              <td>${coin.total_volume.toLocaleString()}</td>

              <td>
                <Sparklines data={coin.sparkline_in_7d.price}>
                  <SparklinesLine
                    color={
                      coin.price_change_percentage_7d_in_currency > 0
                        ? "#4fcf17"
                        : "#cf1717"
                    }
                  />
                </Sparklines>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
