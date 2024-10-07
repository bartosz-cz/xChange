let providers = [];
export function walletsListener() {
  window.addEventListener("eip6963:announceProvider", (event) => {
    providers.push(event.detail);
  });

  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return providers;
}

export function getWalletsList() {
  return providers;
}
