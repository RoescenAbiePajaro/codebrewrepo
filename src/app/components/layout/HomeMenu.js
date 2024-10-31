import Image from "next/legacy/image";

export default function HomeMenu() {
  return (
    <section className="relative flex flex-col items-center">
      <div className="flex justify-center w-full max-w-screen-md space-x-4">
        <div className="h-48 w-48 flex justify-end">
          <Image
            src={'/kitkat.png'}
            width={200}
            height={200}
            alt={'product'}
            objectFit={'contain'}
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
            objectFit={'contain'}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 overflow-auto h-48">
        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image src={'/productq.jpg'} alt={'product3'} layout={'fill'}
            objectFit={'contain'} />
          
          <h4 className="font-semibold mt-2">
            Ice Cream
          </h4>

          <button className="bg-green-500 text-white rounded-full">

          </button>
        </div>
        {/* Add more items as needed */}
      </div>
    </section>
  );
}
