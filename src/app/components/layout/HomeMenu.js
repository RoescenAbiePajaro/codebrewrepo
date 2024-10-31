import Image from "next/image";

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/iceseries.jpg'}
            alt={'productq'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Tealerin Ice Cream Series</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/takoyaki.jpg'}
            alt={'product2'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Tealerin Takoyaki</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/burgerfries.jpg'}
            alt={'product3'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Tealerin Budget Meryenda</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/scrambled.jpg'}
            alt={'product3'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Tealerin Iskrambol 3 for 150</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/productq.jpg'}
            alt={'product3'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Tealerin Buy One Take One</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/icecream.jpg'}
            alt={'product3'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Vanilla Ice Cream</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center">
          <Image
            src={'/meryendadeal.jpg'}
            alt={'product4'}
            width={100}
            height={100}
            objectFit="contain"
            className="mx-auto"
          />
          <h4 className="font-semibold mt-2 text-xl">Meryenda Deal</h4>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 mt-2">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
