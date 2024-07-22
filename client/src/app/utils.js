export default function GetIpfsUrlFromPinata(pinataUrl) {
  let IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl =
    "https://peach-obvious-locust-150.mypinata.cloud/ipfs/" +
    IPFSUrl[lastIndex - 1];
  return IPFSUrl;
}
