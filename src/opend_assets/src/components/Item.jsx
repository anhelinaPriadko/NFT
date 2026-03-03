import React, { use, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/service.did.js";
import {Principal} from "@dfinity/principal";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [isHidden, setIsHidden] = useState(true);

  const { id } = props;
  const localHost = "http://uzt4z-lp777-77774-qaabq-cai.localhost:8000/";
  const agent = new HttpAgent({ host: localHost });

  async function loadNFT() {
    const nftPrincipal = Principal.fromText(id);
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
    setIsHidden(false);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logo}
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
        </div>
      </div>
    </div>
  );
}

export default Item;
