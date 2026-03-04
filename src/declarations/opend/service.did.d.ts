import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getListedNFTs' : ActorMethod<[], Array<Principal>>,
  'getNFTsByOwner' : ActorMethod<[Principal], Array<Principal>>,
  'getOpenDID' : ActorMethod<[], Principal>,
  'getOriginalOwner' : ActorMethod<[Principal], Principal>,
  'getPrice' : ActorMethod<[Principal], bigint>,
  'isListed' : ActorMethod<[Principal], boolean>,
  'listItem' : ActorMethod<[Principal, bigint], string>,
  'mint' : ActorMethod<[string, Uint8Array | number[]], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
