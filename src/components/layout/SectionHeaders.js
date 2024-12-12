export default function SectionHeaders({subHeader,mainHeader}) {
    return (
      <>
        <h3 className="uppercase text-white-500 font-semibold leading-4">
          {subHeader}
        </h3>
        <h2 className="text-green-500 font-bold text-4xl italic">
          {mainHeader}
        </h2>
      </>
    );
  }