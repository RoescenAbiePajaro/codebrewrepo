import Image from "next/image";
import Right from "../icons/Right";
import MenuItem from "../menu/MenuItem";

export default function Hero() {
    return (
        <section className="hero mt-4">
            <div className="py-4">
                <h1 className="text-4xl font-semibold leading-12">
                   &nbsp;
                </h1>
                <p className="mt-6 text-gray-600 leading-relaxed text-sm">
                </p>
                <div className="flex gap-4 mt-6">
                </div>
            </div>
            <div className="relative">
                {/* Only render Image component when you have a valid src */}
                {/* Example:
                <Image
                    src="/your-image.jpg"
                    alt="Hero image"
                    width={400}
                    height={400}
                    className="object-contain"
                /> 
                */}
            </div>
        </section>
    );
}