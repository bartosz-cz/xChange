let providers = [];
export function WalletsInfoListener() {
  window.addEventListener("eip6963:announceProvider", (event) => {
    providers.push(event.detail);
  });

  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return providers;
}

export function getWalletsInfo() {
  return providers;
}
