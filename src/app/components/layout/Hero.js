import Image from "next/legacy/image";
import Right from "../icons/Right";

export default function Hero() {
    return (
        <section className="hero">
            <div className="py-4">
                <h1 className="text-4xl font-semibold  leading-12">
                    Dive into <br/>
                    the Delightful World
                    of &nbsp;
                    <span className="text-green-500">Tealerin MilkTea
                    </span>
                </h1>
                <p className="mt-6 text-gray-600 leading-relaxed text-sm">
                    Where every sip is a celebration of flavor and every product is crafted to perfection.
                </p>
                <div className="flex gap-4 mt-6">
                    <button className="bg-green-500 uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm">
                        Order Here
                        <Right />
                    </button>
                    <button className="flex gap-2 py-2">
                        Learn More<Right />
                    </button>
                </div>
            </div>

            <div className="relative"> {/* Set a height for the image container */}
                <Image 
                    src={'/tealerinlogo.png'}
                    layout={'fill'}
                    objectFit={'contain'}
                    alt={'milktea'}
                />
            </div>
        </section>
    );
}
