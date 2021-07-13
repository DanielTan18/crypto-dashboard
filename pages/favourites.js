import { Table } from "react-bootstrap";
import Image from 'next/image';
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab,faTimes)
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

export default function Favourites({ coins }) {
  const [favourite, setFavourite] = useState([]);
  const formatPercent = (number) => `${new Number(number).toFixed(2)}%`;
  const formatDollar = (number, maxSignificantDigits) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
      maxSignificantDigits,
    }).format(number);

  useEffect(() => {
    //if local storage variable is not empty, favourite = localstorage
    if (
      typeof localStorage.getItem("favArr" !== "undefined") &&
      localStorage.getItem("favArr") !== null
    ) {
      setFavourite(localStorage.getItem("favArr"));
    }
  }, [favourite]);

  const removeFavourite = (id) => {
    setFavourite(localStorage.getItem("favArr").toString().split(","));
    const newArr = [...favourite.toString().split(",")];
    const index = newArr.indexOf(id);
    if (index > -1) {
      newArr.splice(index, 1);
    }
    setFavourite(...newArr.toString().split(","));
    localStorage.setItem("favArr", newArr);
    alert(id.charAt(0).toUpperCase() + id.slice(1) + " has been removed from favourites!");
  };

  return (
    <Container>
      <h1 className="text-center">Favourites</h1>
      <h3>
        <a href="../">Home</a>
      </h3>
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
          {coins
            .filter(function (e) {
              return favourite.includes(e.id);
            })
            .map((coin, index) => (
              <tr key={coin.id}>
                <td>
                  <FontAwesomeIcon
                    icon="times"
                    className="cancelbutton"
                    onClick={(e) => removeFavourite(coin.id)}
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
