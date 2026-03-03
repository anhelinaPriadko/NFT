import React, { use, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/service.did.js";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import {opend} from "../../../declarations/opend";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [isHidden, setIsHidden] = useState(true);
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  const { id } = props;
  const localHost = "http://uzt4z-lp777-77774-qaabq-cai.localhost:8000/";
  const agent = new HttpAgent({ host: localHost });

  async function loadNFT() {
    const nftPrincipal = id;
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: nftPrincipal,
    });

    const nameResult = await NFTActor.getName();
    const ownerResult = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));

    setName(nameResult);
    setOwner(ownerResult.toText());
    setImage(image);

    setButton(<Button handleClick={handleSell} text={"Sell"}/>);
    setIsHidden(false);
  }

  let price;
  function handleSell() {
    setPriceInput(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => price = e.target.value}
      />);
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  }

  async function sellItem() {
    const listingresult = await opend.listItem(id, Number(price));
    console.log("Listing result:", listingresult);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 hidden={isHidden} 
            className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            <span className="purple-text">{name}</span>
          </h2>
          <p hidden={isHidden}
          className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            {`Owner: ${owner}`}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
