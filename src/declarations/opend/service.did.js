export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getNFTsByOwner' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getOpenDID' : IDL.Func([], [IDL.Principal], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
