import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";

persistent actor OpenD {

    let cyclesForNewCanister = 2_000_000_000_000;
    public shared(msg) func mint(name: Text, content: [Nat8]) : async Principal {
        let owner = msg.caller;
        let newNFT = await (with cycles = cyclesForNewCanister) NFTActorClass.NFT(name, owner, content);
        let newNFTPrincipal = Principal.fromActor(newNFT);
        return newNFTPrincipal;
    };
};
