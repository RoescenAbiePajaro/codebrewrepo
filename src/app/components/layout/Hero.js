import Image from "next/image";

export default function Hero() {
    return (
        <section className="grid grid-cols-2 gap-4">
            <div>
                <h1 className="text-4xl font-semibold">
                    Dive into the delightful world of Tealicious Milk Tea
                </h1>
                <p>
                    Where every sip is a celebration of flavor and every product is crafted to perfection.
                </p>
            </div>

            <div className="relative"> {/* Set a height for the image container */}
                <Image 
                    src="/tealerin logo.png"
                    layout="fill"
                    objectFit="contain"
                    alt="milktea"
                />
            </div>
        </section>
    );
}
