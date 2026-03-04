import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

persistent actor OpenD {

    private type Listing = {
        owner: Principal;
        price: Nat;
    };

    transient var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    transient var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    transient var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

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

    public query func getListedNFTs() : async [Principal] {
        let ids = Iter.toArray(mapOfListings.keys());
        return ids;
    };

    public shared(msg) func listItem(id:Principal, price:Nat) : async Text {
        var item: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT not found";
            case (?nft) nft;
        };

        let owner = await item.getOwner();
        if (Principal.equal(owner, msg.caller) == false) {
            return "Only the owner can list this item";
        };

        let listing: Listing = {
            owner = owner;
            price = price;
        };
        mapOfListings.put(id, listing);

        return "Success!"
    };

    public query func getOpenDID (): async Principal{
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id: Principal) : async Bool {
        return switch (mapOfListings.get(id)){
            case null false;
            case (?listing) true;
        };
    };

    public query func getOriginalOwner(id: Principal) : async Principal {
        var listing: Listing = switch (mapOfListings.get(id)){
            case null return Principal.fromText("");
            case (?nft) nft;
        };

        return listing.owner;
    };

    public query func getPrice(id: Principal) : async Nat {
        var listing: Listing = switch (mapOfListings.get(id)){
            case null return 0;
            case (?nft) nft;
        };

        return listing.price;
    };
};
