import Link from "next/link";
export default function Header(){
return (
    <header className="flex items-center justify-between">
      <Link className="text-black-600 gap-8 semi=bold text-2xl"href=""> Tealerin Milktea </Link>
        <nav className="flex gap-4 text-green-600 semi-bold">
          <Link href={''}>Home</Link>
          <Link href={''}>Menu</Link>
          <Link href={''}>About</Link>
          <Link href={''}>Contact</Link>
          <Link href={''} className="bg-green-600 rounded-full text-white px-8 py-2">
          
          Login
          </Link>
        </nav>
    </header>

);
}