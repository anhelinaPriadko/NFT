import React, { use, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/service.did.js";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [isHidden, setIsHidden] = useState(true);
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();

  const { id } = props;
  const localHost = "http://uzt4z-lp777-77774-qaabq-cai.localhost:8000/";
  const agent = new HttpAgent({ host: localHost });
  // TODO: Remove when ready to deploy live
  agent.fetchRootKey();
  let NFTActor;

  async function loadNFT() {
    const nftPrincipal = id;
    NFTActor = await Actor.createActor(idlFactory, {
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

    if(props.role === "collection") {
        const nftListed = await opend.isListed(id);
      if(nftListed) {
        setOwner(`OpenD`);
        setBlur({filter: "blur(4px)"});
        setSellStatus(" - Listed for Sale");
      } else{
        setButton(<Button handleClick={handleSell} text={"Sell"}/>);
      }
    } else if(props.role === "discover") {
      const originalOwner = await opend.getOriginalOwner(id);
      setOwner(originalOwner.toText());
      if(originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }
      const price = await opend.getPrice(id);
      setPriceLabel(<PriceLabel price={price.toString()}/>);
    }
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

  async function handleBuy() {
    console.log("Buying NFT...");
  }

  async function sellItem() {
    setBlur({filter: "blur(4px)"});
    setLoaderHidden(false);
    const listingresult = await opend.listItem(id, Number(price));
    if (listingresult === "Success!") {
      const openDId = await opend.getOpenDID();
      const transferResult =await NFTActor.transferOwnership(openDId);
      if(transferResult === "Ownership transferred successfully") {
        setLoaderHidden(true);
        setSellStatus(" - Listed for Sale");
        setButton();
        setPriceInput();
        setOwner("OpenD");
      }
    }
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
          style={blur}
        />
        {priceLabel}
        {!loaderHidden && (
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        <div className="disCardContent-root">
          <h2 hidden={isHidden} 
            className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
              {name}
            <span className="purple-text">{sellStatus}</span>
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
