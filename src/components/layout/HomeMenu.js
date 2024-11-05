import Image from "next/image";
import MenuItem from "../menu/MenuItem";

export default function HomeMenu() {
  return (
    <section className="relative items-center">
      <div className="flex justify-center w-full max-w-screen-md space-x-4">
        <div className="h-48 w-48 flex justify-end">
          <Image
            src={'/kitkat.png'}
            width={200}
            height={200}
            alt={'product'}
            objectFit="contain"
          />
        </div>

        <div className="text-center flex flex-col justify-center items-center">
          <h3 className="uppercase text-gray-600 font-semibold leading-4">
            Check Out
          </h3>
          <h2 className="text-green-500 font-bold text-4xl">Menu</h2>
        </div>

        <div className="h-48 w-48 flex justify-start">
          <Image
            src={'/oreo_butter.png'}
            alt={'product2'}
            width={200}
            height={200}
            objectFit="contain"
          />
        </div>
      </div>

      {/* Horizontal list for MenuItem components */}
      <div className="flex space-x-4 overflow-x-auto mt-8">
      </div>
      <MenuItem />
    </section>
  );
}
