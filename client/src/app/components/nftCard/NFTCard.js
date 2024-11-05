import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";

import styles from "./NFTCard.module.css";
import Link from "next/link";

export default function NFTCard({ item }) {
  const IPFSUrl = GetIpfsUrlFromPinata(item.image);

  const limitedDescription =
    item.description.length > 100
      ? item.description.substring(0, 100) + "..."
      : item.description;

  return (
    <Link href={`/nft/${item.tokenId}`} className={styles.text}>
      <div className=' bg-fuchsia-600  border-2 overflow-hidden -z-10 h-96 relative'>
        <div className='w-full h-full object-cover'>
          <Image
            src={IPFSUrl}
            alt=''
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className='z-10 absolute bottom-0 bg-black w-full px-4 py-4'>
          <strong>{item.name}</strong>
          <p>{limitedDescription}</p>
        </div>
      </div>
    </Link>
  );
}
