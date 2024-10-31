import Image from "next/image";
export default function MenuItem(){
    return(
        

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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

        <div className=" bg-gray-200 p-4 rounded-lg text-center group hover:bg-green-200">
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
    );
}