import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

persistent actor OpenD {
    transient var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    transient var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

    let cyclesForNewCanister = 2_000_000_000_000;
    public shared(msg) func mint(name: Text, content: [Nat8]) : async Principal {
        let owner = msg.caller;
        let newNFT = await (with cycles = cyclesForNewCanister) NFTActorClass.NFT(name, owner, content);
        let newNFTPrincipal = Principal.fromActor(newNFT);
        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);
        return newNFTPrincipal;
    };

    private func addToOwnershipMap (owner: Principal, nftId: Principal) {
        var ownedNFTs: List.List<Principal> = switch (mapOfOwners.get(owner)){
            case null List.nil<Principal>();
            case (?list) list;
        };

        ownedNFTs := List.push(nftId, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);
    };

    public query func getNFTsByOwner(user: Principal) : async [Principal] {
        var ownedNFTs: List.List<Principal> = switch (mapOfOwners.get(user)){
            case null List.nil<Principal>();
            case (?list) list;
        };

        return List.toArray(ownedNFTs);
    };
};
